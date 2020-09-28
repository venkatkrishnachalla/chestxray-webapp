import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
// SidenavService class implementation
export class SidenavService {
  sidenav: MatSidenav;

  /**
   * This is a setSidenav function.
   *  @param '{any}' data - A array param
   * @example
   * setSidenav(sidenav);
   */

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  /**
   * This is a open function.
   *  @param '{void}' empty - A empty param
   * @example
   * open();
   */

  public open() {
    return this.sidenav.open();
  }

  /**
   * This is a close function.
   *  @param '{void}' empty - A empty param
   * @example
   * close();
   */

  public close() {
    return this.sidenav.close();
  }

  /**
   * This is a toggle function.
   *  @param '{void}' empty - A empty param
   * @example
   * toggle();
   */

  public toggle(): void {
    this.sidenav.toggle();
  }
}
