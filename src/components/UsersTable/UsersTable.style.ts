import styledComponents from "styled-components";

type WrapperProps = {
  elements: number;
};

export const Wrapper = styledComponents.div<WrapperProps>(({ elements }) => ({
  height: `${52 * elements + 111}px`,
}));
