import React, { createElement } from "react";

const moduleInterop = module => {
  return module && module.__esModule ? module.default : module;
};

const Async = getType => {
  let Type;

  function Async(props) {
    if (!Type) return null;
    return <Type {...props} />;
  }

  Async.load = async () => {
    Type = moduleInterop(await getType());
  };

  return Async;
};

Async.createElement = (type, config, ...children) => {
  if (typeof type.then === "function") {
    return createElement(Async(() => type), config, ...children);
  }

  return createElement(type, config, ...children); // NO-OP
};

export default Async;
