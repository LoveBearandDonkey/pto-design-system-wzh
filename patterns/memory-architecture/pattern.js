(function registerPtoMemoryArchitecturePattern(global) {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ROUTE_TONES = {
    transport: {
      line: '#ffcf59',
      fill: '#ffdf1f',
      stroke: '#ffdf1f',
      text: '#111111',
    },
    direct: {
      line: '#4d97ff',
      fill: '#2d75df',
      stroke: '#5db8ff',
      text: '#ffffff',
    },
    directReturn: {
      line: '#29c7a6',
      fill: '#29c7a6',
      stroke: '#5be5c2',
      text: '#ffffff',
    },
  };

  const PRESETS = {
    ascend950b: {
      id: 'ascend950b',
      name: 'Ascend 950B Memory Architecture',
      rails: [
        {
          key: 'GM',
          label: 'Global Memory',
          tone: 'memory-shell',
          grid: {
            rows: 82,
            cols: 8,
            cellSize: 12,
            gap: 4,
            shape: 'hex',
          },
        },
        {
          key: 'L2',
          label: 'L2 Cache',
          tone: 'memory-rail',
          grid: {
            rows: 82,
            cols: 4,
            cellSize: 12,
            gap: 4,
            shape: 'dot',
          },
        },
      ],
      cores: [
        {
          id: 'mem950-aiv1',
          kind: 'aiv',
          title: 'AIV 1',
          presetKey: 'aivOfficialV1',
        },
        {
          id: 'mem950-aic',
          kind: 'aic',
          title: 'AIC',
          presetKey: 'aicDraftV1',
        },
        {
          id: 'mem950-aiv2',
          kind: 'aiv',
          title: 'AIV 2',
          presetKey: 'aivOfficialV1',
        },
      ],
      routes: [
        {
          id: 'l2-to-aiv1-dcache',
          label: 'MTE2',
          tone: 'transport',
          from: '[data-mem950-node="rail:L2"]',
          to: '#mem950-aiv1 [data-aiv-node="cache:DCache"]',
          fromSide: 'right',
          toSide: 'left',
          toBias: 0.50,
          style: 'lane-h-target',
          labelDy: 0,
        },
        {
          id: 'l2-to-aiv1',
          label: 'MTE2',
          tone: 'transport',
          from: '[data-mem950-node="rail:L2"]',
          to: '#mem950-aiv1 [data-aiv-node="buffer:UB"]',
          fromSide: 'right',
          toSide: 'left',
          toBias: 0.58,
          style: 'lane-h-target',
          labelDy: 0,
        },
        {
          id: 'aiv1-to-l2',
          label: 'MTE3',
          tone: 'transport',
          from: '#mem950-aiv1 [data-aiv-node="buffer:UB"]',
          to: '[data-mem950-node="rail:L2"]',
          fromSide: 'left',
          toSide: 'right',
          fromBias: 0.82,
          style: 'lane-h-source',
          labelDy: 0,
        },
        {
          id: 'l2-to-aic',
          label: 'MTE2',
          tone: 'transport',
          from: '[data-mem950-node="rail:L2"]',
          to: '#mem950-aic [data-aic-node="buffer:L1"]',
          fromSide: 'right',
          toSide: 'left',
          toBias: 0.58,
          style: 'lane-h-target',
          labelDy: 0,
        },
        {
          id: 'l2-to-aic-dcache',
          label: 'MTE2',
          tone: 'transport',
          from: '[data-mem950-node="rail:L2"]',
          to: '#mem950-aic [data-aic-node="cache:DCache"]',
          fromSide: 'right',
          toSide: 'left',
          toBias: 0.50,
          style: 'lane-h-target',
          labelDy: 0,
        },
        {
          id: 'aic-to-aiv1',
          label: 'L0C→UB',
          tone: 'direct',
          from: '#mem950-aic [data-aic-node="buffer:L0C"]',
          to: '#mem950-aiv1 [data-aiv-node="buffer:UB"]',
          fromSide: 'right',
          toSide: 'right',
          fromBias: 0.24,
          toBias: 0.70,
          style: 'elbow-h',
          corridorRight: 40,
          labelDy: -12,
        },
        {
          id: 'aiv2-to-aic',
          label: 'UB→L1',
          tone: 'directReturn',
          from: '#mem950-aiv2 [data-aiv-node="buffer:UB"]',
          to: '#mem950-aic [data-aic-node="buffer:L1"]',
          fromSide: 'right',
          toSide: 'right',
          fromBias: 0.30,
          toBias: 0.74,
          style: 'elbow-h',
          corridorRight: 84,
          labelDy: 14,
        },
        {
          id: 'l2-to-aiv2',
          label: 'MTE2',
          tone: 'transport',
          from: '[data-mem950-node="rail:L2"]',
          to: '#mem950-aiv2 [data-aiv-node="buffer:UB"]',
          fromSide: 'right',
          toSide: 'left',
          toBias: 0.58,
          style: 'lane-h-target',
          labelDy: 0,
        },
        {
          id: 'l2-to-aiv2-dcache',
          label: 'MTE2',
          tone: 'transport',
          from: '[data-mem950-node="rail:L2"]',
          to: '#mem950-aiv2 [data-aiv-node="cache:DCache"]',
          fromSide: 'right',
          toSide: 'left',
          toBias: 0.50,
          style: 'lane-h-target',
          labelDy: 0,
        },
        {
          id: 'aiv2-to-l2',
          label: 'MTE3',
          tone: 'transport',
          from: '#mem950-aiv2 [data-aiv-node="buffer:UB"]',
          to: '[data-mem950-node="rail:L2"]',
          fromSide: 'left',
          toSide: 'right',
          fromBias: 0.82,
          style: 'lane-h-source',
          labelDy: 0,
        },
      ],
      notes: [
        '1 AIC + 2 AIV memory-stage layout',
        'L2/GM → DCache, L1, or UB via MTE2',
        'UB → L2/GM via MTE3',
        '950 direct CV lanes: L0C→UB and UB→L1',
      ],
      hoverTips: {
        'rail:GM': {
          title: 'Global Memory',
          body: 'Chip-level memory source and sink for the full-stage architecture.',
        },
        'rail:L2': {
          title: 'L2 Cache',
          body: 'Shared cache rail feeding AIV DCache or UB and AIC DCache or L1 through MTE2 paths.',
        },
        'core:AIV1': {
          title: 'AIV 1',
          body: 'Vector-side core object with DCache, ICache, Scalar, UB, SIMT, SIMD, and Vector lanes.',
        },
        'core:AIC': {
          title: 'AIC',
          body: 'Cube-side compute object with L1, L0 buffers, CUBE, Scalar, dispatch, and execution queues.',
        },
        'core:AIV2': {
          title: 'AIV 2',
          body: 'Second vector-side core object used by the 950B split memory-stage layout.',
        },
        'buffer:UB': {
          title: 'UB',
          body: 'Unified Buffer for AIV vector-side data staging and MTE3 return paths.',
        },
        'buffer:L1': {
          title: 'L1',
          body: 'AIC local memory feeding L0A, L0B, BT, and FP lanes.',
        },
        'buffer:L0A': {
          title: 'L0A',
          body: 'AIC matrix operand buffer for CUBE input staging.',
        },
        'buffer:L0B': {
          title: 'L0B',
          body: 'AIC matrix operand buffer for CUBE input staging.',
        },
        'buffer:L0C': {
          title: 'L0C',
          body: 'AIC CUBE output buffer; 950 direct CV lanes can forward data toward AIV UB.',
        },
        'buffer:BT': {
          title: 'BT',
          body: 'AIC bias or transform-side buffer lane connected through MTE1.',
        },
        'buffer:FP': {
          title: 'FP',
          body: 'AIC FixPipe buffer lane for post-CUBE data movement.',
        },
        'cache:DCache': {
          title: 'DCache',
          body: 'Data cache endpoint for memory transport and scalar-side access.',
        },
        'cache:ICache': {
          title: 'ICache',
          body: 'Instruction cache feeding the scalar or scheduler-side control path.',
        },
        'scalar:Scalar': {
          title: 'Scalar',
          body: 'Scalar control block coordinating local compute and memory movement.',
        },
        'exec:SIMT': {
          title: 'SIMT',
          body: 'AIV SIMT execution lane connected to scalar control and vector output.',
        },
        'exec:SIMD': {
          title: 'SIMD',
          body: 'AIV SIMD execution lane connected to UB data and vector output.',
        },
        'vector:Vector': {
          title: 'Vector',
          body: 'AIV vector execution endpoint receiving SIMT and SIMD results.',
        },
        'cube:CUBE': {
          title: 'CUBE',
          body: 'AIC matrix compute block fed by L0A, L0B, and BT buffers.',
        },
        'scheduler:Dispatch': {
          title: 'Dispatch',
          body: 'AIC dispatch block issuing work into cube, FixPipe, and MTE queues.',
        },
        'queue:Cube Queue': {
          title: 'Cube Queue',
          body: 'Dispatch queue for CUBE-side compute operations.',
        },
        'queue:FixPipe Queue': {
          title: 'FixPipe Queue',
          body: 'Dispatch queue for FixPipe operations.',
        },
        'queue:MTE1 Queue': {
          title: 'MTE1 Queue',
          body: 'Dispatch queue for local memory transfer engine work.',
        },
        'queue:MTE2 Queue': {
          title: 'MTE2 Queue',
          body: 'Dispatch queue for L2-to-local memory transfer work.',
        },
        'transport:MTE1': {
          title: 'MTE1',
          body: 'Local AIC transport lane between L1 and L0 or FixPipe buffers.',
        },
        'transport:FixPipe': {
          title: 'FixPipe',
          body: 'AIC post-processing transport lane.',
        },
      },
    },
  };

  function resolvePreset(presetOrKey) {
    if (typeof presetOrKey === 'string') return PRESETS[presetOrKey] || null;
    return presetOrKey || null;
  }

  function node(tagName, className, textContent) {
    const el = document.createElement(tagName);
    if (className) el.className = className;
    if (textContent !== undefined) el.textContent = textContent;
    return el;
  }

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function readableNodeKey(key) {
    const [, label = key] = String(key || '').split(/:(.*)/);
    return label || String(key || '');
  }

  function nodeKindLabel(target) {
    if (target.dataset.mem950Node) return 'memory architecture';
    if (target.dataset.aicNode) return 'AIC object';
    if (target.dataset.aivNode) return 'AIV object';
    return 'hardware object';
  }

  function tipForTarget(target, preset, options = {}) {
    const key = target.dataset.mem950Node || target.dataset.aicNode || target.dataset.aivNode || '';
    const custom = options.getTip?.(key, target, preset);
    const tip = custom || options.hoverTips?.[key] || preset?.hoverTips?.[key];
    if (typeof tip === 'string') {
      return {
        title: readableNodeKey(key),
        body: tip,
        meta: nodeKindLabel(target),
      };
    }
    if (tip) {
      return {
        title: tip.title || readableNodeKey(key),
        body: tip.body || tip.description || '',
        meta: tip.meta || nodeKindLabel(target),
      };
    }
    return {
      title: readableNodeKey(key),
      body: `${readableNodeKey(key)} in the ${preset?.name || 'memory architecture'} pattern.`,
      meta: nodeKindLabel(target),
    };
  }

  function attrValue(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function rootFor(container) {
    return container?.querySelector?.('.pto-mem950') || container || null;
  }

  function activeRouteEndpoints(routeIds, preset) {
    const ids = new Set(routeIds || []);
    return (preset?.routes || [])
      .filter((route) => ids.has(route.id))
      .flatMap((route) => [route.from, route.to])
      .filter(Boolean);
  }

  function clearPathFocus(container) {
    const root = rootFor(container);
    if (!root) return;
    root.classList.remove('is-path-focused');
    root.querySelectorAll('.is-hardware-active').forEach((el) => el.classList.remove('is-hardware-active'));
    root.querySelectorAll('.is-route-active').forEach((el) => el.classList.remove('is-route-active'));
    root.querySelectorAll('.is-internal-route-active').forEach((el) => el.classList.remove('is-internal-route-active'));
  }

  function applyInternalRouteFocus(root) {
    root.querySelectorAll('.pto-aic-core__route[data-aic-route-from][data-aic-route-to]').forEach((routeEl) => {
      const core = routeEl.closest('.pto-aic-core');
      const fromEl = core?.querySelector(`[data-aic-node="${attrValue(routeEl.dataset.aicRouteFrom)}"]`);
      const toEl = core?.querySelector(`[data-aic-node="${attrValue(routeEl.dataset.aicRouteTo)}"]`);
      const isActive = Boolean(
        fromEl?.classList.contains('is-hardware-active') &&
        toEl?.classList.contains('is-hardware-active')
      );
      routeEl.classList.toggle('is-internal-route-active', isActive);
      if (isActive) {
        core?.querySelectorAll(`[data-aic-transport-to="${attrValue(routeEl.dataset.aicRouteTo)}"]`)
          .forEach((pill) => pill.classList.add('is-internal-route-active'));
      }
    });
  }

  function setPathFocus(container, presetOrKey, focus = {}) {
    const preset = resolvePreset(presetOrKey);
    const root = rootFor(container);
    if (!root || !preset) return null;

    const selectors = Array.from(new Set([
      ...(focus.selectors || []),
      ...activeRouteEndpoints(focus.routes || focus.routeIds || [], preset),
    ].filter(Boolean)));
    const routeIds = Array.from(new Set((focus.routes || focus.routeIds || []).filter(Boolean)));

    clearPathFocus(root);
    root.classList.toggle('is-path-focused', selectors.length > 0 || routeIds.length > 0);

    selectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((el) => el.classList.add('is-hardware-active'));
    });

    routeIds.forEach((routeId) => {
      root.querySelectorAll(`[data-route-id="${attrValue(routeId)}"]`).forEach((el) => el.classList.add('is-route-active'));
    });

    applyInternalRouteFocus(root);

    return {
      root,
      selectors,
      routes: routeIds,
    };
  }

  function svgNode(tagName, attrs) {
    const el = document.createElementNS(SVG_NS, tagName);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  function cloneCorePreset(coreConfig) {
    const helper = coreConfig.kind === 'aiv'
      ? global.PtoAivCorePattern
      : global.PtoAicCorePattern;
    const basePreset = helper?.resolvePreset?.(coreConfig.presetKey);
    if (!basePreset) return null;

    return {
      ...basePreset,
      id: `${basePreset.id}-${coreConfig.id}`,
      title: coreConfig.title,
    };
  }

  function buildRail(railConfig) {
    const rail = node('div', `pto-mem950__rail is-${railConfig.tone || 'memory-shell'}`);
    rail.dataset.mem950Node = `rail:${railConfig.key}`;
    rail.style.width = `${railContentWidth(railConfig.grid) + 36}px`;
    rail.appendChild(buildRailGrid(railConfig.grid));
    rail.appendChild(node('span', 'pto-mem950__rail-label', railConfig.label));
    return rail;
  }

  function railContentWidth(gridConfig) {
    const cols = Math.max(1, Number(gridConfig?.cols || 1));
    const cellSize = Math.max(4, Number(gridConfig?.cellSize || 12));
    const gap = Math.max(0, Number(gridConfig?.gap || 4));
    return cols * cellSize + Math.max(0, cols - 1) * gap;
  }

  function buildRailGrid(gridConfig) {
    const grid = node('div', 'pto-mem950__rail-grid');
    const rows = Math.max(1, Number(gridConfig?.rows || 1));
    const cols = Math.max(1, Number(gridConfig?.cols || 1));
    const cellSize = Math.max(4, Number(gridConfig?.cellSize || 12));
    const gap = Math.max(0, Number(gridConfig?.gap || 4));
    const shape = gridConfig?.shape || 'dot';

    grid.style.setProperty('--pto-mem950-rail-cols', String(cols));
    grid.style.setProperty('--pto-mem950-rail-cell-size', `${cellSize}px`);
    grid.style.setProperty('--pto-mem950-rail-gap', `${gap}px`);

    for (let index = 0; index < rows * cols; index += 1) {
      const cell = node('span', `pto-mem950__rail-cell is-${shape}`);
      grid.appendChild(cell);
    }

    return grid;
  }

  function buildCoreSlot(coreConfig) {
    const slot = node('section', `pto-mem950__core-slot is-${coreConfig.kind}`);
    slot.id = coreConfig.id;
    slot.dataset.mem950Node = `core:${coreConfig.title.replace(/\s+/g, '')}`;
    const mount = node('div', 'pto-mem950__core-mount');
    slot.appendChild(mount);
    return { slot, mount };
  }

  function renderCoreIntoSlot(slotMount, coreConfig) {
    const helper = coreConfig.kind === 'aiv'
      ? global.PtoAivCorePattern
      : global.PtoAicCorePattern;
    const preset = cloneCorePreset(coreConfig);
    if (!helper || !preset) {
      slotMount.appendChild(node('div', 'pto-mem950__missing', `${coreConfig.title} renderer unavailable`));
      return null;
    }
    return helper.render(slotMount, preset);
  }

  function renderArchitecture(container, presetOrKey) {
    const preset = resolvePreset(presetOrKey);
    if (!container || !preset) return null;

    container.innerHTML = '';
    container.dataset.ptoMemArch = 'true';
    container.dataset.ptoMemArchPreset = preset.id;

    const stage = node('section', 'pto-mem950');
    stage.dataset.ptoMemArchStage = preset.id;

    const layout = node('div', 'pto-mem950__layout');
    const rails = node('div', 'pto-mem950__rails');
    const stack = node('div', 'pto-mem950__stack');

    (preset.rails || []).forEach((railConfig) => rails.appendChild(buildRail(railConfig)));

    (preset.cores || []).forEach((coreConfig) => {
      const { slot, mount } = buildCoreSlot(coreConfig);
      stack.appendChild(slot);
      renderCoreIntoSlot(mount, coreConfig);
    });

    layout.appendChild(rails);
    layout.appendChild(stack);
    stage.appendChild(layout);

    if ((preset.notes || []).length > 0) {
      const notes = node('div', 'pto-mem950__notes');
      preset.notes.forEach((item) => notes.appendChild(node('span', 'pto-mem950__note', item)));
      stage.appendChild(notes);
    }

    container.appendChild(stage);

    return {
      container,
      preset,
      stage,
    };
  }

  function edgePoint(root, nodeEl, side, bias) {
    const rootRect = root.getBoundingClientRect();
    const rect = nodeEl.getBoundingClientRect();
    const biasRatio = Math.max(0, Math.min(1, Number.isFinite(bias) ? bias : 0.5));
    const xAtBias = rect.left - rootRect.left + rect.width * biasRatio;
    const yAtBias = rect.top - rootRect.top + rect.height * biasRatio;

    if (side === 'left') return { x: rect.left - rootRect.left, y: yAtBias };
    if (side === 'right') return { x: rect.right - rootRect.left, y: yAtBias };
    if (side === 'top') return { x: xAtBias, y: rect.top - rootRect.top };
    if (side === 'bottom') return { x: xAtBias, y: rect.bottom - rootRect.top };
    return {
      x: rect.left - rootRect.left + rect.width / 2,
      y: rect.top - rootRect.top + rect.height / 2,
    };
  }

  function pointsToPath(points) {
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }

  function resolveLaneX(root, route, fromPoint, toPoint) {
    const rootRect = root.getBoundingClientRect();
    if (Number.isFinite(route.corridorRight)) {
      const stackEl = root.querySelector('.pto-mem950__stack');
      if (stackEl) {
        const stackRect = stackEl.getBoundingClientRect();
        return Math.max(0, stackRect.right - rootRect.left - route.corridorRight);
      }
      return Math.max(0, rootRect.width - route.corridorRight);
    }
    if (Number.isFinite(route.corridorLeft)) return route.corridorLeft;
    return fromPoint.x + (toPoint.x - fromPoint.x) / 2;
  }

  function resolveLaneY(root, route, fromPoint, toPoint) {
    const height = root.getBoundingClientRect().height;
    if (Number.isFinite(route.corridorTop)) return route.corridorTop;
    if (Number.isFinite(route.corridorBottom)) return Math.max(0, height - route.corridorBottom);
    return fromPoint.y + (toPoint.y - fromPoint.y) / 2;
  }

  function routeGeometry(root, route, fromPoint, toPoint) {
    if (route.style === 'lane-h-target') {
      const start = { x: fromPoint.x, y: toPoint.y };
      const end = { x: toPoint.x, y: toPoint.y };
      return {
        points: [start, end],
        labelPoint: {
          x: (start.x + end.x) / 2,
          y: start.y + (route.labelDy || 0),
        },
      };
    }

    if (route.style === 'lane-h-source') {
      const start = { x: fromPoint.x, y: fromPoint.y };
      const end = { x: toPoint.x, y: fromPoint.y };
      return {
        points: [start, end],
        labelPoint: {
          x: (start.x + end.x) / 2,
          y: start.y + (route.labelDy || 0),
        },
      };
    }

    if (route.style === 'elbow-v') {
      const laneY = resolveLaneY(root, route, fromPoint, toPoint);
      const points = [
        fromPoint,
        { x: fromPoint.x, y: laneY },
        { x: toPoint.x, y: laneY },
        toPoint,
      ];
      return {
        points,
        labelPoint: {
          x: (points[1].x + points[2].x) / 2,
          y: points[1].y + (route.labelDy || 0),
        },
      };
    }

    const laneX = resolveLaneX(root, route, fromPoint, toPoint);
    const points = [
      fromPoint,
      { x: laneX, y: fromPoint.y },
      { x: laneX, y: toPoint.y },
      toPoint,
    ];
    return {
      points,
      labelPoint: {
        x: (fromPoint.x + laneX) / 2,
        y: fromPoint.y + (route.labelDy || 0),
      },
    };
  }

  function createRouteOverlay(container, presetOrKey) {
    const preset = resolvePreset(presetOrKey);
    const root = container?.querySelector?.('.pto-mem950') || container;
    if (!root || !preset) return null;

    const svg = svgNode('svg', {
      class: 'pto-mem950__overlay',
      viewBox: '0 0 10 10',
      preserveAspectRatio: 'none',
    });
    const defs = svgNode('defs');
    svg.appendChild(defs);

    Object.entries(ROUTE_TONES).forEach(([key, tone]) => {
      const marker = svgNode('marker', {
        id: `pto-mem950-arrow-${key}`,
        markerWidth: '8',
        markerHeight: '8',
        refX: '7',
        refY: '4',
        orient: 'auto',
      });
      marker.appendChild(svgNode('path', {
        d: 'M1,1 L7,4 L1,7',
        fill: 'none',
        stroke: tone.line,
        'stroke-width': '1.5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }));
      defs.appendChild(marker);
    });

    const routeEls = (preset.routes || []).map((route) => {
      const group = svgNode('g', { 'data-route-id': route.id });
      const path = svgNode('path', {
        fill: 'none',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': route.strokeWidth || '2',
      });
      const labelGroup = svgNode('g');
      const labelBg = svgNode('rect', { rx: '11', ry: '11' });
      const labelText = svgNode('text', {
        'font-size': route.fontSize || '10',
        'font-weight': '700',
        'font-family': 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
      });
      labelText.textContent = route.label || '';
      labelGroup.appendChild(labelBg);
      labelGroup.appendChild(labelText);
      group.appendChild(path);
      group.appendChild(labelGroup);
      svg.appendChild(group);
      return { route, path, labelGroup, labelBg, labelText };
    });

    root.appendChild(svg);

    function update() {
      const rect = root.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, rect.width)} ${Math.max(1, rect.height)}`);

      routeEls.forEach((entry) => {
        const fromEl = root.querySelector(entry.route.from);
        const toEl = root.querySelector(entry.route.to);
        if (!fromEl || !toEl) {
          entry.path.style.display = 'none';
          entry.labelGroup.style.display = 'none';
          return;
        }

        const fromPoint = edgePoint(root, fromEl, entry.route.fromSide || 'right', entry.route.fromBias);
        const toPoint = edgePoint(root, toEl, entry.route.toSide || 'left', entry.route.toBias);
        const geometry = routeGeometry(root, entry.route, fromPoint, toPoint);
        const tone = ROUTE_TONES[entry.route.tone] || ROUTE_TONES.transport;

        entry.path.style.display = '';
        entry.path.setAttribute('d', pointsToPath(geometry.points));
        entry.path.setAttribute('stroke', tone.line);
        entry.path.setAttribute('marker-end', `url(#pto-mem950-arrow-${entry.route.tone || 'transport'})`);
        if (entry.route.dashArray) {
          entry.path.setAttribute('stroke-dasharray', entry.route.dashArray);
        } else {
          entry.path.removeAttribute('stroke-dasharray');
        }

        if (!entry.route.label) {
          entry.labelGroup.style.display = 'none';
          return;
        }

        entry.labelGroup.style.display = '';
        entry.labelText.setAttribute('x', String(geometry.labelPoint.x));
        entry.labelText.setAttribute('y', String(geometry.labelPoint.y));
        entry.labelText.setAttribute('fill', tone.text);
        const textBox = entry.labelText.getBBox();
        const paddingX = 8;
        const paddingY = 4;
        entry.labelBg.setAttribute('x', String(geometry.labelPoint.x - textBox.width / 2 - paddingX));
        entry.labelBg.setAttribute('y', String(geometry.labelPoint.y - textBox.height / 2 - paddingY));
        entry.labelBg.setAttribute('width', String(textBox.width + paddingX * 2));
        entry.labelBg.setAttribute('height', String(textBox.height + paddingY * 2));
        entry.labelBg.setAttribute('fill', tone.fill);
        entry.labelBg.setAttribute('stroke', tone.stroke);
        entry.labelBg.setAttribute('stroke-width', '1');
      });
    }

    const resizeObserver = typeof ResizeObserver === 'function'
      ? new ResizeObserver(update)
      : null;
    resizeObserver?.observe(root);
    root.querySelectorAll('[data-mem950-node], [data-aiv-node], [data-aic-node]').forEach((el) => resizeObserver?.observe(el));
    requestAnimationFrame(() => requestAnimationFrame(update));
    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      document.fonts.ready.then(update);
    }

    return {
      svg,
      update,
      render() {
        update();
      },
      destroy() {
        resizeObserver?.disconnect();
        svg.remove();
      },
    };
  }

  function attachHoverInteractions(container, presetOrKey, options = {}) {
    const preset = resolvePreset(presetOrKey);
    const root = container?.querySelector?.('.pto-mem950') || container;
    if (!root || !preset) return null;

    const selector = options.selector || '[data-mem950-node], [data-aic-node], [data-aiv-node]';
    const tooltip = node('div', 'pto-mem950__hover-tip');
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    root.appendChild(tooltip);

    let activeTarget = null;

    const positionTooltip = (clientX, clientY, fallbackTarget = activeTarget) => {
      const rootRect = root.getBoundingClientRect();
      const tipRect = tooltip.getBoundingClientRect();
      let x = Number.isFinite(clientX) ? clientX - rootRect.left + 14 : 0;
      let y = Number.isFinite(clientY) ? clientY - rootRect.top + 14 : 0;

      if (!Number.isFinite(clientX) && fallbackTarget) {
        const targetRect = fallbackTarget.getBoundingClientRect();
        x = targetRect.left - rootRect.left + targetRect.width / 2 + 12;
        y = targetRect.top - rootRect.top + Math.min(targetRect.height, 28);
      }

      const maxX = Math.max(8, rootRect.width - tipRect.width - 8);
      const maxY = Math.max(8, rootRect.height - tipRect.height - 8);
      tooltip.style.left = `${Math.max(8, Math.min(maxX, x))}px`;
      tooltip.style.top = `${Math.max(8, Math.min(maxY, y))}px`;
    };

    const renderTooltip = (target) => {
      const tip = tipForTarget(target, preset, options);
      clearChildren(tooltip);
      tooltip.appendChild(node('div', 'pto-mem950__hover-tip-title', tip.title));
      if (tip.body) tooltip.appendChild(node('div', 'pto-mem950__hover-tip-body', tip.body));
      if (tip.meta) tooltip.appendChild(node('div', 'pto-mem950__hover-tip-meta', tip.meta));
    };

    const show = (target, event = null) => {
      if (!target) return;
      if (activeTarget && activeTarget !== target) activeTarget.classList.remove('is-hovered');
      activeTarget = target;
      activeTarget.classList.add('is-hovered');
      renderTooltip(target);
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
      positionTooltip(event?.clientX, event?.clientY, target);
    };

    const hide = () => {
      activeTarget?.classList.remove('is-hovered');
      activeTarget = null;
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    const targetFromEvent = (event) => {
      const target = event.target?.closest?.(selector);
      return target && root.contains(target) ? target : null;
    };

    const onPointerOver = (event) => show(targetFromEvent(event), event);
    const onPointerMove = (event) => {
      if (activeTarget) positionTooltip(event.clientX, event.clientY, activeTarget);
    };
    const onPointerOut = (event) => {
      if (!activeTarget) return;
      if (event.relatedTarget && activeTarget.contains(event.relatedTarget)) return;
      const nextTarget = event.relatedTarget?.closest?.(selector);
      if (nextTarget && root.contains(nextTarget)) return;
      hide();
    };
    const onFocusIn = (event) => show(targetFromEvent(event));
    const onFocusOut = () => hide();

    root.addEventListener('pointerover', onPointerOver);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerout', onPointerOut);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);

    return {
      tooltip,
      destroy() {
        root.removeEventListener('pointerover', onPointerOver);
        root.removeEventListener('pointermove', onPointerMove);
        root.removeEventListener('pointerout', onPointerOut);
        root.removeEventListener('focusin', onFocusIn);
        root.removeEventListener('focusout', onFocusOut);
        activeTarget?.classList.remove('is-hovered');
        tooltip.remove();
      },
    };
  }

  function renderBufferGrid() {
    return null;
  }

  global.PtoMemoryArchitecturePattern = {
    presets: PRESETS,
    resolvePreset,
    renderArchitecture,
    createRouteOverlay,
    attachHoverInteractions,
    setPathFocus,
    clearPathFocus,
    renderBufferGrid,
  };
})(window);
