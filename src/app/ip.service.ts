import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Ip } from './ip';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(private http:HttpClient,private storage :Storage) { }
  public async generateKey(): Promise<string>{
    let key = `ip${ parseInt(`${Math.random() * 100}`)}`;
    let ret = await this.storage.get(key);

    while(ret){
      key = `ip${ parseInt(`${Math.random() * 100}`)}`;
      ret = await this.storage.get(key);
    }
    return key;
    }
    public async read(): Promise<Ip[]>{

      let ips: Array<Ip> = [];
      await this.storage.forEach((v, key, i)=>{
        if(key.startsWith("ip")){
            ips.push(v);
        }
      });

      return ips;
    }

    public async create(key: string , ip: Ip){
      console.log("Creating ip: ", ip);
      return await this.storage.set(key, ip);
    }

    public async update(ip: Ip){
      return await this.storage.set( ip.id || ip. title, ip);
    }

    public async delete(key: string){
      return await this.storage.remove(key);
    }
    public ping(ip){
      var url = "http://appcosecha.sofiagestionagricola.cl/ips.php";
      return this.http.get<any[]>(`${url}/?ip=${ip}` , {
        headers: new HttpHeaders()
      });
    }
}
