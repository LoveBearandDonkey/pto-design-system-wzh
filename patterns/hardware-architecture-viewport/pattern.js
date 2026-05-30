(function attachPtoHardwareArchitectureViewport(global) {
  'use strict';

  const DEFAULT_ZOOM_LEVELS = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2];

  const qs = (selector, root = document) => (
    !selector ? null : selector instanceof Element ? selector : root.querySelector(selector)
  );
  const qsa = (selector, root = document) => (
    !selector ? [] : Array.from(root.querySelectorAll(selector))
  );
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function closestZoomLevel(levels, value) {
    const normalized = Array.isArray(levels) && levels.length ? levels : DEFAULT_ZOOM_LEVELS;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return normalized.includes(1) ? 1 : normalized[0];
    return normalized.reduce((closest, level) => (
      Math.abs(level - numeric) < Math.abs(closest - numeric) ? level : closest
    ), normalized[0]);
  }

  function zoomIndex(levels, value) {
    return Math.max(0, levels.indexOf(closestZoomLevel(levels, value)));
  }

  function mount(rootInput, options = {}) {
    const root = qs(rootInput);
    if (!root) return null;

    const levels = options.zoomLevels || DEFAULT_ZOOM_LEVELS;
    const state = {
      frameReady: options.mode === 'inline',
      detailsVisible: options.detailsVisible !== false,
      scale: closestZoomLevel(levels, options.scale || options.defaultScale || 1),
      fitted: options.fitted !== false,
      frameSize: options.frameSize || { width: 1200, height: 820 },
    };

    const elements = {
      viewport: qs(options.viewport, root),
      scale: qs(options.scaleEl, root),
      frame: qs(options.frame, root),
      archSelect: qs(options.archSelect, root),
      detailToggle: qs(options.detailToggle, root),
      zoomOut: qs(options.zoomOut, root),
      zoomIn: qs(options.zoomIn, root),
      fit: qs(options.fit, root),
      actual: qs(options.actual, root),
      readout: qs(options.readout, root),
      pathButtons: qsa(options.pathButtons, root),
    };

    function syncReadout() {
      if (elements.readout) elements.readout.textContent = `${Math.round(state.scale * 100)}%`;
      const index = zoomIndex(levels, state.scale);
      if (elements.zoomOut) elements.zoomOut.disabled = index <= 0;
      if (elements.zoomIn) elements.zoomIn.disabled = index >= levels.length - 1;
    }

    function applyScale(scale, updateFitted = false) {
      state.scale = closestZoomLevel(levels, scale);
      if (!updateFitted) state.fitted = false;

      if (options.scaleVariable && elements.viewport) {
        elements.viewport.style.setProperty(options.scaleVariable, String(state.scale));
      } else if (elements.frame && elements.scale) {
        elements.frame.style.width = `${state.frameSize.width}px`;
        elements.frame.style.height = `${state.frameSize.height}px`;
        elements.frame.style.transform = `scale(${state.scale})`;
        elements.scale.style.width = `${Math.ceil(state.frameSize.width * state.scale)}px`;
        elements.scale.style.height = `${Math.ceil(state.frameSize.height * state.scale)}px`;
      } else if (elements.scale) {
        elements.scale.style.transform = `scale(${state.scale})`;
      }

      syncReadout();
      options.onScaleChange?.(state.scale, api);
    }

    function fit() {
      if (!elements.viewport) {
        applyScale(1, true);
        return;
      }
      const availableWidth = Math.max(1, elements.viewport.clientWidth - (options.fitPaddingX ?? 28));
      const availableHeight = Math.max(1, elements.viewport.clientHeight - (options.fitPaddingY ?? 76));
      const naturalWidth = Math.max(1, state.frameSize.width);
      const naturalHeight = Math.max(1, state.frameSize.height);
      state.fitted = true;
      applyScale(Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight), true);
    }

    function actual() {
      state.fitted = false;
      applyScale(1);
    }

    function stepZoom(direction) {
      const currentIndex = zoomIndex(levels, state.scale);
      const nextIndex = clamp(currentIndex + direction, 0, levels.length - 1);
      applyScale(levels[nextIndex]);
    }

    function postToFrame(message) {
      if (!elements.frame?.contentWindow || !state.frameReady) return false;
      elements.frame.contentWindow.postMessage(message, '*');
      return true;
    }

    function setDetailsVisible(visible) {
      state.detailsVisible = visible !== false;
      if (elements.detailToggle) {
        elements.detailToggle.textContent = state.detailsVisible ? (options.detailOnText || '细节开') : (options.detailOffText || '细节关');
        elements.detailToggle.title = state.detailsVisible
          ? (options.detailOnTitle || '隐藏细节数据')
          : (options.detailOffTitle || '显示细节数据');
        elements.detailToggle.setAttribute('aria-label', elements.detailToggle.title);
        elements.detailToggle.setAttribute('aria-pressed', state.detailsVisible ? 'true' : 'false');
      }

      if (options.mode === 'inline') {
        const host = qs(options.inlineHost || options.scaleEl || options.viewport, root);
        global.PtoMemoryArchitecturePattern?.setDetailVisibility?.(host, state.detailsVisible);
      } else {
        postToFrame({ type: 'hardware-details', visible: state.detailsVisible });
      }

      options.onDetailChange?.(state.detailsVisible, api);
    }

    function setArch(id) {
      if (!id) return;
      options.onArchChange?.(id, api);
      const preset = options.presetForArch?.(id);
      if (preset) postToFrame({ type: 'hardware-arch-change', preset });
    }

    function setPathKind(kind) {
      elements.pathButtons.forEach((button) => {
        button.classList.toggle('is-selected', button.dataset.pathKind === kind);
      });
      options.onPathKindChange?.(kind, api);
    }

    function setFrameSize(width, height) {
      state.frameSize = {
        width: Math.max(1, Number(width) || state.frameSize.width),
        height: Math.max(1, Number(height) || state.frameSize.height),
      };
      if (state.fitted) fit();
      else applyScale(state.scale, true);
    }

    function markReady() {
      state.frameReady = true;
      setDetailsVisible(state.detailsVisible);
      if (elements.archSelect) setArch(elements.archSelect.value);
      options.onReady?.(api);
    }

    function handleMessage(event) {
      if (!elements.frame || event.source !== elements.frame.contentWindow) return;
      if (!event.data || (event.data.type !== 'hardware-ready' && event.data.type !== 'hardware-size')) return;
      setFrameSize(event.data.width, event.data.height);
      if (event.data.type === 'hardware-ready') markReady();
    }

    elements.detailToggle?.addEventListener('click', () => setDetailsVisible(!state.detailsVisible));
    elements.zoomOut?.addEventListener('click', () => stepZoom(-1));
    elements.zoomIn?.addEventListener('click', () => stepZoom(1));
    elements.fit?.addEventListener('click', fit);
    elements.actual?.addEventListener('click', actual);
    elements.archSelect?.addEventListener('change', () => setArch(elements.archSelect.value));
    elements.pathButtons.forEach((button) => {
      button.addEventListener('click', () => setPathKind(button.dataset.pathKind));
    });
    elements.frame?.addEventListener('load', () => requestAnimationFrame(markReady));
    global.addEventListener('message', handleMessage);
    global.addEventListener('resize', () => {
      if (state.fitted) fit();
    });

    const api = {
      root,
      state,
      elements,
      applyScale,
      fit,
      actual,
      stepZoom,
      setDetailsVisible,
      setArch,
      setPathKind,
      setFrameSize,
      markReady,
      postToFrame,
      destroy() {
        global.removeEventListener('message', handleMessage);
      },
    };

    setDetailsVisible(state.detailsVisible);
    applyScale(state.scale, true);
    if (options.fitOnMount) requestAnimationFrame(fit);

    return api;
  }

  global.PtoHardwareArchitectureViewport = {
    DEFAULT_ZOOM_LEVELS,
    closestZoomLevel,
    zoomIndex,
    mount,
  };
})(window);
