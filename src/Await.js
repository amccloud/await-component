import {Component, PropTypes} from 'react';
import reactTreeWalker from 'react-tree-walker';

export default class Await extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    loading: PropTypes.element,
    error: PropTypes.element,
    timeout: PropTypes.number,
    delay: PropTypes.number
  };

  static defaultProps = {
    delay: 200
  };

  state = {
    loading: true,
    showLoading: false
  };

  async componentWillMount() {
    const {children} = this.props;
    const pending = [];
    const elements = Array.isArray(children) ? children : [children];
    const walking = elements.map(
      element => reactTreeWalker(element, () => true, {
        await: pending
      })
    );

    await Promise.all(walking);
    await Promise.all(pending);

    this.clearTimeouts();
    this.setState({loading: false});
  }

  componentDidMount() {
    const {delay, timeout} = this.props;

    if (delay) {
      this.showLoadingTimeout = setTimeout(
        () => this.setState({showLoading: true}),
        delay
      );
    } else {
      this.setState({showLoading: true});
    }

    if (timeout) {
      this.showErrorTimeout = setTimeout(
        () => this.setState({showError: true}),
        timeout
      );
    }
  }

  componentWillUnmount() {
    this.clearTimeouts();
  }

  clearTimeouts() {
    clearTimeout(this.showLoadingTimeout);
    clearTimeout(this.showErrorTimeout);
  }

  render() {
    if (this.state.showError) return this.props.error;
    if (this.state.showLoading && this.state.loading) return this.props.loading;
    return this.props.children;
  }
}
