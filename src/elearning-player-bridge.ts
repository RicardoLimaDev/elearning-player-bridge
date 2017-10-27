/// <reference types="greensock" />
/// <reference types="createjs" />
/// <reference types="preloadjs" />
/// <reference types="soundjs" />


export class ElearningPlayerBridge 
{

  public static ON_READY:string = "on_ready";
  
  /**
  * @property player
  * @type {any}
  * @public
  */
  public player: any;

  /**
  * @property timeline
  * @type {TimelineLite}
  * @public
  */
  public timeline: TimelineLite;

  /**
  * @property playing
  * @type {boolean}
  * @public
  */
  public playing: boolean;

  /**
  * @property _manifest
  * @type {string[]}
  * @private
  */
  private _manifest: string[];

  /**
  * @property sound
  * @type {createjs.AbstractSoundInstance}
  * @public
  */
  public sound: createjs.AbstractSoundInstance;

  /**
  * @property preload
  * @type {createjs.LoadQueue}
  * @public
  */
  public preload:createjs.LoadQueue;

  /**
  * @property eventDispatchersDictionary
  * @type {any[]}
  * @public
  */
  public eventDispatchersDictionary:any;

  constructor(assetsManifest?:string[])
  {
    this.eventDispatchersDictionary = {};

    //assets list manifest;;
    this.manifest = assetsManifest;    
  }
  /**
   * Start assets loading (TODO: add more initializations)
  */
  public start = (playerWindow:Window):void =>
  {
    console.log("[ElearningPlayerBridge] start");

    this.player = playerWindow;
    this.load();
  }

  public init = ():void =>
  {
    console.log("[ElearningPlayerBridge] init: ", window);

    this.onReady();

    //holding all page animations on a timeline
    this.timeline = (<any>window).TimelineLite ? (<any>window).TimelineLite.exportRoot() : null;

    //ao iniciar a página, seta o status para "playing";
    this.playing = true;
  }

  /**
   * Play sounds based on id
   */
  public playSound(id:string):void
  {
    this.sound = createjs.Sound.play(id);
  }

  /**
   * Must be used to define the page custom code;
   * Users must override this method or listen to this event;
   */
  protected onReady = ():void =>
  {
    console.log("[ElearningPlayerBridge] onReady dispatch");

    // dispatch a on_ready event.
    this.dispatchEventWith(ElearningPlayerBridge.ON_READY);
  }
  
  public addEventListener(eventName:string, handler:Function):void
  {
    console.log("[ElearningPlayerBridge] addEventListener");

    this.eventDispatchersDictionary[eventName] = handler;
  }

  public dispatchEventWith(eventName:string):void
  {
    setTimeout(this.eventDispatchersDictionary[eventName], 0);
  }

  /**
   * Page status toggle
   */
  public togglePlayPause = ():void =>
  {
      console.log("[ElearningPlayerBridge] togglePlayPause");

      //TODO: pausar o som;
      if( this.playing )
      {
          this.pause();
      }
      else
      {
          this.resume();
      }            
  }

  /**
   * Execute resume on animation instances (TimelineLite), sound instances (SoundJS), change page status state;
   */
  public resume = ():void =>
  {
      console.log("[ElearningPlayerBridge] resume");

      if(this.timeline) this.timeline.resume();
      if(this.sound) this.sound.paused = false;
      this.playing = true;
  }

  /**
   * Execute pause on animation instances (TimelineLite), sound instances (SoundJS), change page status state;
   */
  public pause = ():void =>
  {
      console.log("[ElearningPlayerBridge] pause");

      if(this.timeline) this.timeline.pause();
      if(this.sound) this.sound.paused = true;
      this.playing = false;
  }

  /**
   * Page assets loading;
   */
  public load = ():void =>
  {
    console.log("[ElearningPlayerBridge] load");

    if(this.manifest)
    {
      this.preload = new createjs.LoadQueue(true, "./assets/");
      this.preload.installPlugin(createjs.Sound); 
      this.preload.on("fileload", this.handleFileLoad);
      this.preload.on("progress", this.handleOverallProgress);
      this.preload.on("error", this.handleFileError);

      while (this.manifest.length > 0) { this.loadAnother(); }
    }
    else
    {
      console.log("[ElearningPlayerBridge] load - no manifest");

      //Informa o player sobre o carregamento;
      if(this.player) this.player.postMessage( {messageType: 'loadprogress', value: 1 }, "*");

      this.init();
    }
  }

  public loadAnother = ():void =>
  {
      // Get the next manifest item, and load it
      var item = this.manifest.shift();
      this.preload.loadFile(item);

      if (this.manifest.length == 0) 
      {
          //console.log("all assets included on stack");
      }
  }

  // File complete handler
  public handleFileLoad = (event):void =>
  {
      //console.log("file loaded: ", event.item.id);
      var item = event.item;

      switch (item.type) 
      {
          case "sound":
          break;

          case "image":
          break;
      }

      //console.log("file loaded result: ", event.result);
      if(this.preload.progress >= 1)
      {
          console.log("loading complete - calling init");
          this.init();
          //this.sound = createjs.Sound.play("stones.mp3");
      }
  }

  /**
   * Inform player about overall progress;
   */
  public handleOverallProgress =(event) :void =>
  {
      //console.log("progress: ", preload.progress);
      if(this.player)
      {
          this.player.postMessage( {messageType: 'loadprogress', value: this.preload.progress }, "*");
      } 
  }

  // An error happened on a file
  public handleFileError(event) 
  {
      //console.log("error loading: ", event.item.id);
  }

  public get manifest():string[] 
  {
      return this._manifest;
  }

  public set manifest(value:string[])
  {
      this._manifest = value;
  }
}


        

        

        
