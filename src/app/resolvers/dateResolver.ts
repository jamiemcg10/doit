import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const dateResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const dateString = route.paramMap.get('date')!;
  const date = new Date(dateString);

  // TODO: test regex, if invalid, route to not found

  return !!date ? dateString : new Date().toLocaleDateString('en-CA');
};
