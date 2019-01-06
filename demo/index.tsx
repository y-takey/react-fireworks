import * as React from "react";
import { render } from "react-dom";
import Fireworks from "../src";

const Root = () => (
  <div>
    <Fireworks />
  </div>
);

render(<Root />, document.getElementById("root"));
