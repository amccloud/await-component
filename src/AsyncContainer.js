import {Component, PropTypes, createElement} from 'react';

const moduleInterop = module => {
  return module && module.__esModule ? module.default : module;
};

export default class AsyncContainer extends Component {
  static displayName = 'Async';

  static propTypes = {
    type: PropTypes.any, // TODO: Enforce promise?
    config: PropTypes.object,
    children: PropTypes.any
  };

  static contextTypes = {
    await: PropTypes.array
  };

  state = {
    loadedType: null
  };

  componentWillMount() {
    const {props, context} = this;

    if (context.await) {
      context.await.push(
        props.type.then(module => this.setState({
          loadedType: moduleInterop(module)
        })) // TODO: Handle exceptions
      );
    } else {
      props.type.then(module => this.setState({
        loadedType: moduleInterop(module)
      }));
    }
  }

  render() {
    if (!this.state.loadedType) return null;
    return createElement(
      this.state.loadedType,
      this.props.config,
      ...this.props.children
    );
  }
}
