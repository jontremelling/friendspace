import { Injectable } from "@angular/core";
import { User } from "./user";
import { Observable, throwError } from "rxjs";
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpClient
} from "@angular/common/http";

import { UserService } from "../user-service";

@Injectable({
  providedIn: "root"
})
export class FileUploadService {
  baseURL = "http://localhost:5000/api/users";
  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("x-auth-token", localStorage.token);

  constructor(private http: HttpClient) {}

  // Get Users
  getUsers() {
    return this.http.get(this.baseURL);
  }

  // Create User
  addUser(id: string, profileImage: File): Observable<any> {
    var formData: any = new FormData();
    formData.append("id", id);
    formData.append("avatar", profileImage);

    return this.http.post<User>(`${this.baseURL}/update-profile`, formData, {
      reportProgress: true,
      observe: "events"
    });
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}