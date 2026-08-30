import { Component } from "react";

/**
 * Generic error boundary. Wrap any section (a whole page, the header, a
 * single widget) with this so that if THAT piece throws a render error, only
 * that piece falls back to a small message instead of taking down the rest
 * of the page.
 *
 * Pass `resetKey` (e.g. the current route's pathname) when you want the
 * boundary to automatically clear itself once that key changes - otherwise
 * a crashed section would stay crashed even after the user navigates away
 * and back.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the failure visible in devtools without crashing the app.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.hasError &&
      this.props.resetKey !== undefined &&
      this.props.resetKey !== prevProps.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full py-10 px-4 text-center text-sm text-gray-500">
            Something went wrong while loading this section.
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
