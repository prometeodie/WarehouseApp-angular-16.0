import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private readonly baseUrl: string = environment.baseUrl;
    private http = inject( HttpClient )

    public _currentUser = signal< User|null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);
    private _userRol = signal<string>('');

    public currentUser = computed(( )=> this._currentUser());
    public authStatus = computed(( )=> this._authStatus());


  constructor() {
    this.checkAuthStatus().subscribe();
    console.log(this.currentUser())
   }

   private setUserAuthentication(user: User, accessToken: string): boolean{
          this._currentUser.set(user);
          this._authStatus.set( AuthStatus.authenticated  );
          localStorage.setItem('token', accessToken);
          localStorage.setItem('id', user.id.toString());

          return true;
    }

  login (email:string, password:string): Observable<boolean>{

    const url = `${this.baseUrl}/login`;
    const body = {email, password};
    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map(({user, accessToken})=>{
        console.log('peticion post',user)
        return this.setUserAuthentication(user, accessToken);
      }),
      map(()=> true),

      // error
      catchError(err => throwError(()=> err.error.message))
    )
  }

  checkAuthStatus(): Observable<boolean>{
    // const url = `${this.baseUrl}/600/users/2`;
    const token = localStorage.getItem('token');


    if(!token) {
      this._authStatus.set( AuthStatus.noAuthenticated );
      return of(false)
    };
    const id = parseInt( localStorage.getItem('id')!);
    this._authStatus.set( AuthStatus.authenticated );
    this.http.get<User>(`${this.baseUrl}/users/${id}`).subscribe(user =>{
      this._currentUser.set(user );
      this._userRol.set(user.roles);
    })
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

  logOutUser(){
    localStorage.clear();
    this._currentUser.set(null);
    this._userRol.set('');
    this._authStatus.set(AuthStatus.noAuthenticated);
  }

}


