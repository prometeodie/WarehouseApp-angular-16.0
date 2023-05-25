import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import {  Observable, Subject, catchError, map, of, throwError } from 'rxjs';
import { Rol } from '../interfaces/rol.iterface';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private readonly baseUrl: string = environment.baseUrl;
    private http = inject( HttpClient )

    // signals
    public _currentUser = signal< User|null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    public currentUser = computed(( )=> this._currentUser());
    public authStatus = computed(( )=> this._authStatus());


    //  Subject to save the user's rol
    private UserRol$ = new Subject<string>();


  constructor() {
    this.checkAuthStatus().subscribe();
   }

   private setUserAuthentication(user: User, accessToken: string): boolean{
          this._currentUser.set(user);
          this._authStatus.set( AuthStatus.authenticated );

          localStorage.setItem('token', accessToken);
          localStorage.setItem('id', user.id.toString());
          this.setUsersRol(user.roles);


          return true;
    }

  login (email:string, password:string): Observable<boolean>{

    const url = `${this.baseUrl}/login`;
    const body = {email, password};
    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map(({user, accessToken})=>{
        this.getUsersRol().subscribe(resp => console.log('login',resp))
        return this.setUserAuthentication(user, accessToken);
      }),
      map(()=> true),

      // error
      catchError(err => throwError(()=> err.error.message))
    )
  }

  checkAuthStatus(): Observable<boolean>{

    const token = localStorage.getItem('token');

    if(!token) {
      this._authStatus.set( AuthStatus.noAuthenticated );
      return of(false)
    };
    const id = parseInt( localStorage.getItem('id')!);
    this._authStatus.set( AuthStatus.authenticated );

    this.http.get<User>(`${this.baseUrl}/users/${id}`).pipe(
      map( user =>{this.setUserAuthentication(user, token);
        this.getUsersRol().subscribe(resp => console.log('check',resp))
      }
      )
    ).subscribe()
    return of(true);

    //TODO: Real solution for a real case "below"

    // const headers = new HttpHeaders()
    // .set('Authorization',`Bearer ${token}`);

    // return this.http.get<CheckTokenResponse>(url, { headers })
    // .pipe(
    //     map(({accessToken, user}) => {
    //     return this.setUserAuthentication(user, accessToken);
    //     }),
    //     catchError((err)=>{
    //       this._authStatus.set(AuthStatus.noAuthenticated);
    //       return of(false);
    //     })
    // )
  }

  // Setter and Getter to manage the User's Rol

  setUsersRol(UserRol:string) {
    this.UserRol$.next(UserRol);
  }

  getUsersRol() {
    return this.UserRol$.asObservable();
  }


  logOutUser(){
    localStorage.clear();
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.noAuthenticated);
    this.setUsersRol('');
  }

}


