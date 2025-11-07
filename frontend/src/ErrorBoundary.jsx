// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true, error };
   }

   componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
   }

   render() {
      if (this.state.hasError) {
         return (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
               <h2>Something went wrong.</h2>
               <details>
                  {this.state.error && this.state.error.toString()}
               </details>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;