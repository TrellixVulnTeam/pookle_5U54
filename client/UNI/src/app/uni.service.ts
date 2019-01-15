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
  //url = "http://121.145.54.15:5000"
  //url = "http://127.0.0.1:5000"
  url = "http://13.209.117.30:5000";

  registerNewUser(userData): Observable<any>{
    return this.http.post(this.url+'/users', userData)
    //return this.http.post('http://123.142.171.25:5000/users', userData, httpOptions)
  }

  signIn(userData): Observable<any>{
    return this.http.post(this.url+'/user/login', userData)
    //return this.http.post('http://123.142.171.25:5000/user/login', userData, httpOptions)
  }
  authentication():void{
    let token = localStorage.getItem('token');
    let tokenData = {'access_token':token}
    let auth = this.http.post(this.url+'//auth', tokenData)
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
    return this.http.get(this.url+'/user');
  }
  editNick(nick):Observable<any>{
    return this.http.put(this.url+'/user/nick',nick);
  }
  changePasswd(pwForm):Observable<any>{
    return this.http.put(this.url+'/user/pw',pwForm);
  }
  loadUserList(): Observable<any>{
    return this.http.get(this.url+'/users')
  }
  checkUserId(postData):Observable<any>{
    return this.http.post(this.url+'/user/check-id',postData)
  }
  checkQueAns(postData):Observable<any>{
    return this.http.post(this.url+'/user/check-que-ans',postData)
  }

  //타임라인
  getTimelineList(option:number):Observable<any>{
    let postData = {option:option};
    return this.http.get(this.url+'/timeline/'+option)
  }
  getAdminPost():Observable<any>{
    return this.http.get(this.url+'/timeline/admin')
  }
  getAdvertise():Observable<any>{
    return this.http.get(this.url+'/timeline/advertise')
  }
  writePost(postData):Observable<any>{
    return this.http.post(this.url+'/timeline/admin',postData);
  }
  writeAdvertise(postData):Observable<any>{
    return this.http.post(this.url+'/timeline/advertise',postData);
  }
  favTimeline(postData):Observable<any>{
    return this.http.put(this.url+'/timeline/fav',postData); 
  }
  unFavTimeline(postData):Observable<any>{
    return this.http.put(this.url+'/timeline/un-fav',postData); 
  }
  addFavTag(tag):Observable<any>{
    return this.http.post(this.url+'/user/fav-tag',tag);
  }
  addBlackTag(tag):Observable<any>{
    return this.http.post(this.url+'/user/black-tag',tag);
  }
  removeFavTag(tag):Observable<any>{
    return this.http.put(this.url+'/user/fav-tag',tag); 
    // 삭제. delete메서드를 쓰고싶었으나 delete는 body를 담을 수 없으므로 put으로 대체.
  }
  removeBlackTag(tag):Observable<any>{
    return this.http.put(this.url+'/user/black-tag',tag); 
    // 삭제. delete메서드를 쓰고싶었으나 delete는 body를 담을 수 없으므로 put으로 대체.
  }
  removePost(postData){
    return this.http.put(this.url+'/timeline',postData); 
  }
  addView(postData){
    return this.http.put(this.url+'/timeline/view',postData);
  }


  
  // 게시판
  getBoardList():Observable<any>{
    return this.http.get(this.url+'/board')
  }
  sendPost(postData):Observable<any>{
    return this.http.post(this.url+'/board',postData);
  }
  getBoard(id):Observable<any>{
    return this.http.get(this.url+'/board?id='+id);
  }
  deletePost(id):Observable<any>{
    return this.http.delete(this.url+'/board?id='+id);
  }
  updatePost(postData):Observable<any>{
    return this.http.put(this.url+'/board', postData);
  }
  sendComment(postData, post_id):Observable<any>{
    let postData_ = {
      contents:postData.contents,
      _id:post_id
    }
    return this.http.post(this.url+'/board/comment',postData_);
  }
  deleteComment(postData):Observable<any>{
    let postData_ = {
      type:'delete',
      post_id:postData.post_id,
      comment_id:postData.comment_id
    }
    return this.http.put(this.url+'/board/comment', postData_);
  }
  updateComment(postData):Observable<any>{
    let postData_ = {
      type:'delete',
      post_id:postData.post_id,
      comment_id:postData.comment_id
    }
    return this.http.put(this.url+'/board/comment', postData_);
  }
  favBoard(id):Observable<any>{
    return this.http.put(this.url+'/board/fav',id); 
  }
  unFavBoard(id):Observable<any>{
    return this.http.put(this.url+'/board/un-fav',id); 
  }


  //검색
  search(postData):Observable<any>{
    return this.http.post(this.url+'/search',postData); 
  }
}




