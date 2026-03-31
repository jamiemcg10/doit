import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const dateResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const dateString = route.paramMap.get('date')!;
  const date = dateString ? new Date(dateString) : new Date();

  // TODO: test regex, if invalid, route to not found
  console.log({ date });
  return !!dateString ? dateString : date.toLocaleDateString('en-CA');
};
