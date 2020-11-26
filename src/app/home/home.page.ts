import { Component } from '@angular/core';
import { IpService } from '../ip.service';
import { Ip } from '../ip';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    public ips: Array<Ip> = [];
    constructor(public alertController : AlertController,public ipService: IpService) {}
    async ngOnInit(){
      this.ips = await this.ipService.read();
      console.log(this.ips);
      if(this.ips.length == 0){
        this.alertNewFeature("Ahora se puede eliminar!");
      }

    }
    getIcon(ip){
      if(ip.completed) return 'checkmark-circle';
      else return 'stopwatch';
    }
    public async createIp(){
      let key = await this.ipService.generateKey();
      this.alertConfirmar(key);

    }
    public async borrarIp(indice){
      console.log(indice);
      var nodo = this.ips.splice(indice,1);
      var id = nodo[0]['id'];
      await this.ipService.delete(id);
      this.ngOnInit();
    }
    async alertConfirmar(key) {
      const alert = await this.alertController.create({
        cssClass: 'alertLarge',
        header: 'Que ip vas a usar!',
        inputs: [
          {
            name: 'ip',
            type: 'text',
            placeholder: 'Ingresa la ip'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              //////console.log('Confirm Cancel');
            }
          }, {
            text: 'Aceptar',
            handler: (dato) => {
              var ip = dato['ip'];
              let ipNueva = {
                id : key,
                title: `${ip}`,
                note: "Nueva ip",
                completed: true
              };
              this.crear(key,ipNueva)
            }
          }
        ]
      });

      await alert.present();
    }
    async alertNewFeature(text) {
      const alert = await this.alertController.create({
        cssClass: 'alertLarge',
        header: text,        
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          }          
        ]
      });
      await alert.present();
    }
    async crear(key,ipNueva){
      await this.ipService.create(key,ipNueva);
      this.ips = await this.ipService.read();
    }
    comprobarTodos(){
      var self = this;
      this.ips.map(ip=>{
          ip.completed = false;
          self.ipService.update(ip);
          self.ipService.ping(ip.title).subscribe(data=>{
            console.log(data);
            self.ips.map(ip=>{
              var dat = Object.keys(data);
              if(dat && dat[0]){
                var dato = dat[0];
                if(ip.title==dato){
                  ip.completed = true;
                  self.ipService.update(ip);
                }
              }
            })
          })
      });
    }
  }
