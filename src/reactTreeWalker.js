/* eslint-disable no-console */

// Inspired by the awesome work done by the Apollo team.
// See https://github.com/apollostack/react-apollo/blob/master/src/server.ts
// This version has been adapted to be promise based.

// eslint-disable-next-line import/no-extraneous-dependencies
import {Children} from 'react';
import pMapSeries from 'p-map-series';

export const isPromise = x => x != null && typeof x.then === 'function';

// Recurse an React Element tree, running visitor on each element.
// If visitor returns `false`, don't call the element's render function
// or recurse into its child elements
export default function reactTreeWalker(element, visitor, context) {
  return new Promise(resolve => {
    const doVisit = (getChildren, visitorResult, childContext, isChildren) => {
      const doTraverse = shouldContinue => {
        if (!shouldContinue) {
          // We recieved a false, which indicates a desire to stop traversal.
          resolve();
        }

        const child = getChildren();
        const theChildContext = typeof childContext === 'function'
          ? childContext()
          : childContext;

        if (child == null) {
          // If no children then we can't traverse.  We've reached the leaf.
          resolve();
        } else if (isChildren) {
          // If its a react Children collection we need to breadth-first
          // traverse each of them.
          const mapper = aChild =>
            aChild
              ? reactTreeWalker(aChild, visitor, theChildContext)
              : undefined;
          // pMapSeries allows us to do depth-first traversal. Thanks @sindresorhus!
          pMapSeries(Children.map(child, cur => cur), mapper).then(resolve);
        } else {
          // Otherwise we pass the individual child to the next recursion.
          reactTreeWalker(child, visitor, theChildContext).then(resolve);
        }
      };

      if (visitorResult === false) {
        // Visitor returned false, indicating a desire to not traverse.
        resolve();
      } else if (isPromise(visitorResult)) {
        // We need to execute the result and pass it's result through to our
        // continuer.
        visitorResult.then(doTraverse).catch(e => {
          console.log(
            'Error occurred in Promise based visitor result provided to react-tree-walker.'
          );
          if (e) {
            console.log(e);
            if (e.stack) {
              console.log(e.stack);
            }
          }
        });
      } else {
        doTraverse(true);
      }
    };

    // Is this element a Component?
    if (typeof element.type === 'function') {
      const Component = element.type;
      const props = Object.assign({}, Component.defaultProps, element.props);

      // Is this a class component? (http://bit.ly/2j9Ifk3)
      const isReactClassComponent = Component.prototype &&
        (Component.prototype.isReactComponent ||
          Component.prototype.isPureReactComponent);

      if (isReactClassComponent) {
        // React class component

        const instance = new Component(props, context);

        // In case the user doesn't pass these to super in the constructor
        instance.props = instance.props || props;
        instance.context = instance.context || context;

        // Make the setState synchronous.
        instance.setState = newState => {
          instance.state = Object.assign({}, instance.state, newState);
        };

        doVisit(
          () => {
            // Call componentWillMount if it exists.
            if (instance.componentWillMount) {
              instance.componentWillMount();
            }

            return props.children;
          },
          visitor(element, instance, context),
          () =>
            // Ensure the child context is initialised if it is available. We will
            // need to pass it down the tree.
            instance.getChildContext
              ? Object.assign({}, context, instance.getChildContext())
              : context,
          true
        );
      } else {
        // Stateless Functional Component
        doVisit(
          () => props.children,
          visitor(element, null, context),
          context,
          true
        );
      }
    } else {
      // This must be a basic element, such as a string or dom node.
      doVisit(
        () =>
          element.props && element.props.children
            ? element.props.children
            : undefined,
        visitor(element, null, context),
        context,
        true
      );
    }
  });
}
