import { Component, PropTypes } from "react";
import reactTreeWalker from "./reactTreeWalker";

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
    showError: false,
    showLoading: false,
    showChildren: false
  };

  async componentWillMount() {
    const { children } = this.props;
    const pending = [];
    const elements = Array.isArray(children) ? children : [children];
    const walking = elements.map(element =>
      reactTreeWalker(element, element => {
        if (!element.type || !element.type.load) return;
        pending.push(element.type.load());
      }));

    await Promise.all(walking);

    try {
      await Promise.all(pending);
      this.setState({ showChildren: true });
    } catch (error) {
      this.setState({ showError: true });
      throw error;
    } finally {
      this.clearTimeouts();
    }
  }

  componentDidMount() {
    const { delay, timeout } = this.props;

    if (delay) {
      this.showLoadingTimeout = setTimeout(
        () => this.setState({ showLoading: true }),
        delay
      );
    } else {
      this.setState({ showLoading: true });
    }

    if (timeout) {
      this.showErrorTimeout = setTimeout(
        () => this.setState({ showError: true }),
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
    if (this.state.showChildren) return this.props.children;
    if (this.state.showLoading) return this.props.loading;
    return null;
  }
}
