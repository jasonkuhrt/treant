/**
 * Navigation expectation error
 * @generated
 */

export interface NavigationErrorContext {
  expectedNodeType: string;
  actualNodeType: string | null;
  path?: string[];
  searchText?: string;
}

export class NavigationExpectationError extends Error {
  public readonly context: NavigationErrorContext;

  constructor(message: string, context: NavigationErrorContext) {
    super(message);
    this.name = 'NavigationExpectationError';
    this.context = context;
  }
}
