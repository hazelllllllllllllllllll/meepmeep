'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var web = require('solid-js/web');
var solidJs = require('solid-js');
var store = require('solid-js/store');

const createArray = (startPosition, count) => {
  const array = [];

  for (let i = 0; i < count; i += 1) {
    array.push(startPosition + i);
  }

  return array;
};
const getFiniteNumberOrZero = value => Number.isFinite(value) ? value : 0;
const doesElementContainFocus = element => element.matches(':focus-within');
const findFocusedElement = container => {
  // If element contains focus it must be instanceof HTMLElement,
  // otherwise it's always null
  const element = container.querySelector(':focus');
  return element;
};
const clickFocusedElement = container => {
  const element = findFocusedElement(container);

  if (element) {
    element.click();
    return true;
  }

  return false;
}; // Get element offset relative to the target element excluding css transforms.

const getOffsetBetweenElements = (targetEl, startEl) => {
  let element = startEl;
  let top = 0;
  let left = 0;

  while (element && targetEl !== element) {
    const {
      offsetTop,
      offsetLeft,
      offsetParent
    } = element; // Check if nearest containing root is or is inside target element.

    if (targetEl.contains(offsetParent)) {
      top += offsetTop;
      left += offsetLeft;
    } else {
      top += offsetTop - targetEl.offsetTop;
      left += offsetLeft - targetEl.offsetLeft;
      break;
    }

    element = offsetParent;
  }

  return {
    offsetTop: top,
    offsetLeft: left
  };
};

const ScrollTargetContext = solidJs.createContext();

const getSizeFromResizeEntry = entry => {
  let width = 0;
  let height = 0;

  if (entry.borderBoxSize) {
    const {
      borderBoxSize
    } = entry;
    const size = Array.isArray(borderBoxSize) ? borderBoxSize[0] : borderBoxSize;
    width = size.inlineSize;
    height = size.blockSize;
  } else {
    // TODO. As of yet Safari 14 still doesn't support borderBoxSize.
    // getBoundingClientRect changes in respect of css transform
    // so this is partial solution, I have no way to test if this
    // is working correctly.
    const rect = entry.target.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }

  return {
    width,
    height
  };
};

const createAxis = (axisA, axisB, flip) => {
  const [main, cross] = flip ? [axisA, axisB] : [axisB, axisA];
  return {
    main,
    cross
  };
};

const DEFAULT_SIZE = {
  main: 0,
  cross: 0
};

const doCrossAxisSizeMatch = (a, b) => a.cross === b.cross;

const createMeasurementsObserver = props => {
  const scrollTargetContext = solidJs.useContext(ScrollTargetContext);
  const [containerEl, setContainerRefEl] = solidJs.createSignal(undefined);

  const targetEl = () => props.scrollTarget || scrollTargetContext?.scrollTarget;

  const isDirectionHorizontal = solidJs.createMemo(() => (props.direction || 'vertical') === 'horizontal');
  const [measurements, setMeasurements] = store.createStore({
    isMeasured: false,
    mainAxisScrollValue: 0,
    target: { ...DEFAULT_SIZE
    },
    container: { ...DEFAULT_SIZE,
      offsetMain: 0,
      offsetCross: 0
    },
    itemSize: { ...DEFAULT_SIZE
    }
  });

  const onEntry = entry => {
    const entryTarget = entry.target;
    const target = targetEl();
    const container = containerEl();
    const isHorizontal = isDirectionHorizontal();
    const size = getSizeFromResizeEntry(entry);
    const axisSize = createAxis(size.width, size.height, isHorizontal);

    if (entryTarget === target) {
      setMeasurements('target', axisSize);
    } else if (entryTarget === container) {
      if (!doCrossAxisSizeMatch(measurements.container, axisSize) || !measurements.isMeasured) {
        const offset = getOffsetBetweenElements(target, container);
        const offsetAxis = createAxis(offset.offsetLeft, offset.offsetTop, isHorizontal);
        setMeasurements('container', { ...axisSize,
          offsetMain: offsetAxis.main,
          offsetCross: offsetAxis.cross
        });
      }
    }
  };

  const getLiveScrollValue = () => {
    const target = targetEl();

    if (target) {
      const value = isDirectionHorizontal() ? target.scrollLeft : target.scrollTop; // We are not interested in subpixel values.

      return Math.floor(value);
    }

    return 0;
  };

  const ro = new ResizeObserver(entries => {
    solidJs.batch(() => {
      entries.forEach(entry => onEntry(entry));
      setMeasurements({
        isMeasured: true,
        mainAxisScrollValue: getLiveScrollValue()
      });
    });
  });
  solidJs.createComputed(() => {
    if (!measurements.isMeasured) {
      return;
    }

    const isHorizontal = isDirectionHorizontal();
    const size = props.itemSize;
    let itemSizeResolved;

    if (typeof size === 'function') {
      itemSizeResolved = size(measurements.container.cross, isHorizontal);
    } else {
      itemSizeResolved = size;
    }

    const itemAxis = createAxis(itemSizeResolved.width || 0, itemSizeResolved.height || 0, isHorizontal);
    setMeasurements('itemSize', itemAxis);
  });

  const onScrollHandle = () => {
    setMeasurements('mainAxisScrollValue', getLiveScrollValue());
  };

  solidJs.createEffect(() => {
    const target = targetEl();
    const container = containerEl();

    if (!target || !container) {
      return;
    }

    target.addEventListener('scroll', onScrollHandle);
    ro.observe(target);
    ro.observe(container);
    solidJs.onCleanup(() => {
      setMeasurements('isMeasured', false);
      target.removeEventListener('scroll', onScrollHandle);
      ro.unobserve(target);
      ro.unobserve(container);
    });
  });
  return {
    containerEl,
    setContainerRefEl,
    isDirectionHorizontal,
    measurements
  };
};

const ELEMENT_USED_FOR_FOCUS = 1;
const diffPositions = options => {
  const {
    total,
    focusPosition,
    positionCount,
    startPosition,
    prevPositions,
    prevStartPosition
  } = options;
  const prevPositionsCount = prevPositions.length;
  const arePositionsStatic = total <= positionCount;

  if (arePositionsStatic) {
    if (prevPositionsCount === positionCount && prevStartPosition === startPosition) {
      return prevPositions;
    }

    return createArray(0, positionCount);
  }

  const endPosition = startPosition + positionCount;

  const isPositionOutOfBounds = pos => pos < startPosition || pos >= endPosition; // Focused position must remain static,
  // so add one more position.


  const findExpandedPositionForFocus = () => {
    if (isPositionOutOfBounds(focusPosition)) {
      return focusPosition;
    }

    let newPosition;

    if (endPosition < total) {
      newPosition = endPosition; // At the very end of the list there is nowhere to add new postion
      // so instead insert it before startPosition.
    } else {
      newPosition = startPosition - 1;
    }

    return newPosition;
  };

  const newPositionsTotalCount = positionCount + ELEMENT_USED_FOR_FOCUS; // If arrays are different size diffing won't work.
  // This ussually happens when layout size changes.

  if (prevPositionsCount !== newPositionsTotalCount) {
    const newPositions = createArray(startPosition, positionCount);
    newPositions.push(findExpandedPositionForFocus());
    return newPositions;
  }

  const unusedPositions = [];

  for (let i = 0; i < positionCount; i += 1) {
    const position = startPosition + i;

    if (!prevPositions.includes(position)) {
      unusedPositions.push(position);
    }
  }

  const newAddedPosition = findExpandedPositionForFocus();

  if (!prevPositions.includes(newAddedPosition)) {
    unusedPositions.push(newAddedPosition);
  }

  return prevPositions.map(prevPosition => {
    if (isPositionOutOfBounds(prevPosition) && prevPosition !== newAddedPosition) {
      return unusedPositions.pop();
    }

    return prevPosition;
  });
};

const getIntegerOrZero = value => Number.isInteger(value) ? value : 0;
const createMainAxisPositions = (measurements, axis, getOverscan) => {
  const [state, setState] = store.createStore({
    overscan: 0,
    positionCount: 0,
    maxScrollPosition: 0,
    currentPosition: 0
  });
  solidJs.createComputed(() => {
    if (!measurements.isMeasured) {
      return;
    }

    const totalElementCount = axis.totalItemCount;
    const mItemSize = measurements.itemSize.main;
    const mTargetSize = measurements.target.main;
    solidJs.untrack(() => {
      const MINIMUM_OVERSCAN_DISTANCE = 180;
      const overscanNotSafe = getOverscan() ?? Math.max(Math.ceil(MINIMUM_OVERSCAN_DISTANCE / mItemSize), 2);
      const overscan = getFiniteNumberOrZero(overscanNotSafe);
      setState('overscan', overscan); // Calculate how many elements are visible on screen.

      const mainAxisVisibleCount = Math.ceil(mTargetSize / mItemSize);
      const positionCount = getIntegerOrZero(Math.min(mainAxisVisibleCount + overscan * 2, totalElementCount));
      setState('positionCount', positionCount);
      setState('maxScrollPosition', totalElementCount - positionCount);
    });
  });
  solidJs.createComputed(() => {
    if (!measurements.isMeasured) {
      return;
    } // Calculate scrollValue only from place where itemsContainer starts.


    const scrollValueAdjusted = measurements.mainAxisScrollValue - measurements.container.offsetMain; // Scroll position is an index representing each item's place on screen.

    const basePosition = Math.floor(scrollValueAdjusted / measurements.itemSize.main);
    const positionAdjusted = basePosition - state.overscan; // Clamp scroll position so it doesn't exceed bounds.

    const currentPosition = Math.min(Math.max(0, positionAdjusted), state.maxScrollPosition);
    setState('currentPosition', currentPosition);
  });
  let prevPosition = 0;
  const positions = solidJs.createMemo((prev = []) => {
    if (!measurements.isMeasured) {
      return prev;
    }

    const startPosition = state.currentPosition;
    const newPositions = diffPositions({
      total: axis.totalItemCount,
      focusPosition: axis.focusPosition,
      positionCount: state.positionCount,
      startPosition,
      prevStartPosition: prevPosition,
      prevPositions: prev
    });
    prevPosition = startPosition;
    return newPositions;
  });
  return positions;
};

const _tmpl$ = web.template(`<div></div>`, 2);
const uniqueHash = Math.random().toString(36).slice(2, Infinity); // Avoid conflicting class names.

const CONTAINER_CLASSNAME = `virtual-container-${uniqueHash}`;
let globalContainerStylesheet; // Dom bindings are expensive. Even setting the same style values
// causes performance issues, so instead apply static styles
// ahead of time using global style tag.

const insertGlobalStylesheet = () => {
  if (!globalContainerStylesheet) {
    globalContainerStylesheet = document.createElement('style');
    globalContainerStylesheet.type = 'text/css';
    globalContainerStylesheet.textContent = `
      .${CONTAINER_CLASSNAME} {
        position: relative !important;
        flex-shrink: 0 !important;
      }
      .${CONTAINER_CLASSNAME} > * {
        will-change: transform !important;
        box-sizing: border-box !important;
        contain: strict !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }
    `;
    document.head.appendChild(globalContainerStylesheet);
  }
};

function VirtualContainer(props) {
  insertGlobalStylesheet();
  const [state, setState] = store.createStore({
    focusPosition: 0,
    mainAxis: {
      totalItemCount: 0,
      focusPosition: 0,
      scrollValue: 0
    },
    crossAxis: {
      totalItemCount: 0
    }
  });
  const {
    containerEl,
    setContainerRefEl,
    isDirectionHorizontal,
    measurements
  } = createMeasurementsObserver(props); // This selector is used for position calculations,
  // so value must always be current.
  // itemsMemo below is used only for rendering items.

  const itemsCount = () => props.items && props.items.length || 0;

  solidJs.createComputed(() => {
    if (!measurements.isMeasured) {
      return;
    }

    const cTotal = getFiniteNumberOrZero(props.crossAxisCount?.(measurements, itemsCount()) || 0); // There are always must be at least one column.

    setState('crossAxis', {
      totalItemCount: Math.max(1, cTotal)
    });
  });
  solidJs.createComputed(() => {
    if (!measurements.isMeasured) {
      return;
    }

    const iCount = itemsCount();
    const cTotal = state.crossAxis.totalItemCount;
    const mTotal = Math.ceil(iCount / cTotal);
    setState('mainAxis', {
      totalItemCount: getFiniteNumberOrZero(mTotal)
    });
    setState('crossAxis', {
      totalItemCount: cTotal,
      positions: createArray(0, state.crossAxis.totalItemCount)
    });
  });
  solidJs.createComputed(() => {
    const mFocusPos = Math.floor(state.focusPosition / state.crossAxis.totalItemCount);
    setState('mainAxis', 'focusPosition', getFiniteNumberOrZero(mFocusPos));
  });
  const mainAxisPositions = createMainAxisPositions(measurements, state.mainAxis, () => props.overscan);

  const containerStyleProps = () => {
    const containerSize = state.mainAxis.totalItemCount * measurements.itemSize.main;
    const property = isDirectionHorizontal() ? 'width' : 'height';
    const property2 = isDirectionHorizontal() ? 'height' : 'width';
    return {
      [property]: `${containerSize}px`,
      [property2]: '100%'
    };
  };

  const getItemStyle = (mainPos, crossPos = 0) => {
    const size = measurements.itemSize;
    const mainSize = size.main * mainPos;
    const crossSize = size.cross * crossPos;
    let xTranslate = crossSize;
    let yTranslate = mainSize;
    let width = size.cross;
    let height = size.main;

    if (isDirectionHorizontal()) {
      xTranslate = mainSize;
      yTranslate = crossSize;
      width = size.main;
      height = size.cross;
    }

    return {
      transform: `translate(${xTranslate}px, ${yTranslate}px)`,
      width: width ? `${width}px` : '',
      height: height ? `${height}px` : ''
    };
  };

  const crossAxisPositions = solidJs.createMemo(() => createArray(0, state.crossAxis.totalItemCount)); // When items change, old positions haven't yet changed,
  // so if there are more positions than items things will break.
  // This memo delays resolving items until new positions are calculated.

  const items = solidJs.createMemo(() => props.items || []);

  const calculatePosition = (m, c) => m * state.crossAxis.totalItemCount + c;

  const MainAxisItems = itemProps => web.createComponent(solidJs.Index, {
    get each() {
      return mainAxisPositions();
    },

    children: mainPos => {
      const index = solidJs.createMemo(() => {
        const mPos = mainPos();
        const cPos = itemProps.crossPos;

        if (cPos === undefined) {
          return mPos;
        }

        return calculatePosition(mPos, cPos);
      });
      return web.createComponent(solidJs.Show, {
        get when() {
          return index() < items().length;
        },

        get children() {
          return web.createComponent(web.Dynamic, {
            get component() {
              return props.children;
            },

            get items() {
              return items();
            },

            get item() {
              return items()[index()];
            },

            get index() {
              return index();
            },

            get tabIndex() {
              return index() === state.focusPosition ? 0 : -1;
            },

            get style() {
              return getItemStyle(mainPos(), itemProps.crossPos);
            }

          });
        }

      });
    }
  });

  const virtualElements = solidJs.children(() => // If there less than 2 cross axis columns
  // use fast path with only one loop, instead of 2.
  web.createComponent(solidJs.Show, {
    get when() {
      return state.crossAxis.totalItemCount > 1;
    },

    get fallback() {
      return web.createComponent(MainAxisItems, {});
    },

    get children() {
      return web.createComponent(solidJs.Index, {
        get each() {
          return crossAxisPositions();
        },

        children: crossPos => web.createComponent(MainAxisItems, {
          get crossPos() {
            return crossPos();
          }

        })
      });
    }

  }));

  const findFocusPosition = () => {
    const cPositions = crossAxisPositions();
    const mPositions = mainAxisPositions();
    const elements = virtualElements();
    const focusedElementIndex = elements.findIndex(element => // inside grid last few elements can be undefined,
    // so safeguard for undefined.
    element?.matches(':focus-within, :focus'));

    if (focusedElementIndex === -1) {
      return -1;
    }

    if (state.crossAxis.totalItemCount > 1) {
      const cIndex = Math.floor(focusedElementIndex / mPositions.length);
      const mIndex = focusedElementIndex % mPositions.length;
      const cPos = cPositions[cIndex];
      const mPos = mPositions[mIndex];
      const focusPosition = calculatePosition(mPos, cPos);
      return focusPosition;
    } // If grid is one dimenisonal (i.e. just list) index
    // maps directly to position.


    return mPositions[focusedElementIndex];
  };

  const moveFocusHandle = (increment, isMainDirection) => {
    const fPosition = state.focusPosition;
    let cPos = fPosition % state.crossAxis.totalItemCount;
    let mPos = Math.floor(fPosition / state.crossAxis.totalItemCount);

    if (isMainDirection) {
      mPos += increment;
    } else {
      cPos += increment;
    }

    const newFocusPos = calculatePosition(mPos, cPos); // Prevent focus position from going out of list bounds.

    if (newFocusPos < 0 || newFocusPos >= itemsCount()) {
      return;
    }

    const cIndex = crossAxisPositions().indexOf(cPos);

    if (cIndex === -1) {
      return;
    }

    setState('focusPosition', newFocusPos); // After focusPosition is set elements and positions might have changed.

    const elements = virtualElements();
    const mPositions = mainAxisPositions();
    const mIndex = mPositions.indexOf(mPos);

    if (mIndex === -1) {
      return;
    }

    const newIndex = cIndex * mPositions.length + mIndex;
    const foundEl = elements[newIndex];

    if (!foundEl) {
      return;
    }

    queueMicrotask(() => {
      foundEl.focus();
      foundEl.scrollIntoView({
        block: 'nearest'
      });
    });
  };

  const onKeydownHandle = e => {
    const {
      code
    } = e;
    const isArrowUp = code === 'ArrowUp';
    const isArrowDown = code === 'ArrowDown';
    const isArrowLeft = code === 'ArrowLeft';
    const isArrowRight = code === 'ArrowRight';
    const isArrowUpOrDown = isArrowUp || isArrowDown;
    const isArrowLeftOrRight = isArrowLeft || isArrowRight;

    if (isArrowUpOrDown || isArrowLeftOrRight) {
      const isArrowDownOrRight = isArrowDown || isArrowRight;
      moveFocusHandle(isArrowDownOrRight ? 1 : -1, isDirectionHorizontal() ? isArrowLeftOrRight : isArrowUpOrDown);
    } else if (code === 'Enter') {
      if (!clickFocusedElement(containerEl())) {
        return;
      }
    } else {
      return;
    }

    e.preventDefault();
  };

  const onFocusInHandle = () => {
    // Restore previous focus position. For example user switching tab
    // back and forth.
    const newFocusPosition = findFocusPosition();
    setState('focusPosition', newFocusPosition === -1 ? 0 : newFocusPosition);
  };

  const onFocusOutHandle = async () => {
    queueMicrotask(() => {
      if (!doesElementContainFocus(containerEl())) {
        setState('focusPosition', 0);
      }
    });
  };

  return (() => {
    const _el$ = _tmpl$.cloneNode(true);

    _el$.$$focusout = onFocusOutHandle;
    _el$.$$focusin = onFocusInHandle;
    _el$.$$keydown = onKeydownHandle;
    const _ref$ = setContainerRefEl;
    typeof _ref$ === "function" ? _ref$(_el$) : setContainerRefEl = _el$;

    web.insert(_el$, virtualElements);

    web.effect(_p$ => {
      const _v$ = `${CONTAINER_CLASSNAME} ${props.className || ''}`,
            _v$2 = containerStyleProps(),
            _v$3 = props.role || 'list';

      _v$ !== _p$._v$ && (_el$.className = _p$._v$ = _v$);
      _p$._v$2 = web.style(_el$, _v$2, _p$._v$2);
      _v$3 !== _p$._v$3 && web.setAttribute(_el$, "role", _p$._v$3 = _v$3);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined
    });

    return _el$;
  })();
}

web.delegateEvents(["keydown", "focusin", "focusout"]);

exports.ScrollTargetContext = ScrollTargetContext;
exports.VirtualContainer = VirtualContainer;
//# sourceMappingURL=index.js.map
