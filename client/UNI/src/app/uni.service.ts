import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UniService {
  serverData: JSON;
  employeeData: JSON;
  current_user = {
    user_id:'asdf',
  }
  constructor(
    private http: HttpClient,
  ) { 
  }

  registerNewUser(userData): Observable<any>{
    return this.http.post('http://localhost:5000/users', userData)
    //return this.http.post('http://123.142.171.25:5000/users', userData, httpOptions)
  }

  signIn(userData): Observable<any>{
    return this.http.post('http://localhost:5000/user/login', userData)
    //return this.http.post('http://123.142.171.25:5000/user/login', userData, httpOptions)
  }
  authentication():void{
    let token = localStorage.getItem('token');
    let tokenData = {'access_token':token}
    let auth = this.http.post('http:/localhost:5000/auth', tokenData)
    auth.subscribe(response => {
      this.current_user = {
        user_id:response['user_id'],
      }
    });
  }
  is_auth():boolean{
    if(this.current_user.user_id)
      return true
    else
      return false
  }

  /// 유저
  getUserDetail():Observable<any>{
    return this.http.get('http://localhost:5000/user');
  }
  editNick(nick):Observable<any>{
    return this.http.put('http://localhost:5000/user/nick',nick);
  }
  changePasswd(pwForm):Observable<any>{
    return this.http.put('http://localhost:5000/user/pw',pwForm);
  }
  loadUserList(): Observable<any>{
    return this.http.get('http://localhost:5000/users')
  }


  //타임라인
  getTimelineList(option:number):Observable<any>{
    let postData = {option:option};
    return this.http.get('http://localhost:5000/timeline/'+option)
  }
  favTimeline(postData):Observable<any>{
    return this.http.put('http://localhost:5000/timeline/fav',postData); 
  }
  unFavTimeline(postData):Observable<any>{
    return this.http.put('http://localhost:5000/timeline/un-fav',postData); 
  }
  addFavTag(tag):Observable<any>{
    return this.http.post('http://localhost:5000/user/fav-tag',tag);
  }
  removeFavTag(tag):Observable<any>{
    return this.http.put('http://localhost:5000/user/fav-tag',tag); 
    // 삭제. delete메서드를 쓰고싶었으나 delete는 body를 담을 수 없으므로 put으로 대체.
  }
  removePost(id){
    return this.http.put('http://localhost:5000/timeline',id); 
  }
  writePost(postData):Observable<any>{
    return this.http.post('http://localhost:5000/timeline',postData);
  }

  
  // 게시판
  getBoardList():Observable<any>{
    return this.http.get('http://localhost:5000/board')
  }
  sendPost(postData):Observable<any>{
    return this.http.post('http://localhost:5000/board',postData);
  }
  sendComment(postData, post_id):Observable<any>{
    let postData_ = {
      contents:postData.contents,
      _id:post_id
    }
    return this.http.post('http://localhost:5000/board/comment',postData_);
  }
  deleteComment(postData):Observable<any>{
    let postData_ = {
      type:'delete',
      post_id:postData.post_id,
      comment_id:postData.comment_id
    }
    return this.http.put('http://localhost:5000/board/comment', postData_);
  }
  favBoard(id):Observable<any>{
    return this.http.put('http://localhost:5000/board/fav',id); 
  }
  unFavBoard(id):Observable<any>{
    return this.http.put('http://localhost:5000/board/un-fav',id); 
  }


  //검색
  search(postData):Observable<any>{
    return this.http.post('http://localhost:5000/search',postData); 
  }
}




