import React from 'react';
import PropTypes from 'react-proptypes';
import ResizeObserver from 'resize-observer-polyfill';
import { cloneNode, forceRedraw, isOverflowing } from './utils/DOM';
import debounce from 'lodash.debounce';

// usually only needs about 10 attempts per resize with these settings
const PRECISION = 1;
const MAX_ATTEMPTS = 50;

class GreedyText extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          loaded: false,
          fontSize: 0,
      };
  }

  componentDidMount() {
      const hasSiblings = this._node.parentElement.children.length > 1;
      if (hasSiblings) throw new Error('Container has multiple children: GreedyText can\'t have any siblings');

      const onResize = debounce(() => {
        this.resize();
      }, 200);

      this.resizeObserver = new ResizeObserver(onResize);
      this.resizeObserver.observe(this._node.parentElement);
  }

  componentWillUnmount() {
      this.resizeObserver.disconnect(this._node.parentElement);
      this._node = null;
  }

  componentWillReceiveProps() {
    window.requestAnimationFrame(this.resize);
  }

  get parentStyle() {
    return getComputedStyle(this._node.parentElement);
  }

  get height() {
    if (!this._node) return '0';

    return parseInt(this.parentStyle.height, 10) - this.verticalPadding + 'px'
  }

  get width() {
    if (!this._node) return '0';

    return parseInt(this.parentStyle.width, 10) - this.horizontalPadding + 'px'
  }

  get verticalPadding() {
    if (!this._node) return '0';

    return parseFloat(this.parentStyle.paddingTop) + parseFloat(this.parentStyle.paddingBottom);
  }

  get horizontalPadding() {
    if (!this._node) return '0';

    return parseFloat(this.parentStyle.paddingLeft) + parseFloat(this.parentStyle.paddingRight);
  }

  get top() {
    if (!this._node) return '0';

    return this._node.parentElement.offsetTop + parseFloat(this.parentStyle.paddingTop);
  }

  get left() {
    if (!this._node) return '0';

    return this._node.parentElement.offsetLeft + parseFloat(this.parentStyle.paddingLeft);
  }

  resize = () => {
      let fontSize = this.state.fontSize;

      if (!this.height || !this.width) return;

      const { clone, cleanUp } = cloneNode(this._node, {
          display: getComputedStyle(this._node, null).display,
          width: this.width,
          height: this.height,
      });

      let floor = this.props.minFont;
      let ceiling = this.props.maxFont;
      let newFontSize = parseInt(clone.style.fontSize, 10);

      for (let i = 0; i < MAX_ATTEMPTS; i++) {
          const overflowing = isOverflowing(clone);
          const range = Math.abs(ceiling - floor);

          if (!overflowing && range < PRECISION) break;

          if (overflowing) {
              ceiling = newFontSize;
          } else {
              floor = newFontSize;
          }

          newFontSize = (floor + ceiling) / 2;
          clone.style.fontSize = `${newFontSize}px`;

          forceRedraw(clone); // needed to recalculate on some browsers

          fontSize = newFontSize;
      }

      // remove the temporary element tree from the DOM
      cleanUp();

      this.setState({ fontSize, }, () => {
        if (!this.state.loaded) {
          this.setState({ loaded: true });
        }
      });
  };

  bindRef = (_node) => {
      this._node = _node;

    // We don't need this initial resize call since ResizeObserver
    // appears to always fire when it initializes
    // this.resize();
  };

  render() {
      const { fontSize, loaded } = this.state;
      const { children, style } = this.props;
      const transition = loaded ? style.transition : 'none';

      return (
        <span
          ref={this.bindRef}
          style={{
              ...style,
              overflow: 'hidden',
              transition,
              position: 'absolute',
              top: this.top,
              left: this.left,
              right: 0,
              bottom: 0,
              height: this.height,
              width: this.width,
              fontSize: `${fontSize}px`,
          }}
        >
          {children}
        </span>
    );
  }
}

GreedyText.propTypes = {
    children: PropTypes.node,
    minFont: PropTypes.number,
    maxFont: PropTypes.number,
    style: PropTypes.object,
};

GreedyText.defaultProps = {
    minFont: 1,
    maxFont: 1000,
    style: {},
};

GreedyText.displayName = 'GreedyText';

export default GreedyText;
