import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback: ReactNode; onFail?: () => void }
interface State { failed: boolean }

/** If the WebGL scene throws, render the static sky instead of a blank page. */
export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
