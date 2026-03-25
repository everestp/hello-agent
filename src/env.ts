import dotenv from 'dotenv'
let loaded = false;
export function loadenv():void{
  if(loaded) return;
 dotenv.config()
 loaded=true
}
