/// <reference types="greensock" />
/// <reference types="createjs" />
/// <reference types="preloadjs" />
/// <reference types="soundjs" />

export class ElearningPlayerBridge 
{
    public static ON_READY:string = "on_ready";
    public static ON_LOAD_PROGRESS:string = "on_load_progress";
    public static ON_SUBTITLE:string = "on_subtitle";

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
    * @property _sound
    * @type {createjs.AbstractSoundInstance}
    * @public
    */
    public _sound: createjs.AbstractSoundInstance;

    /**
    * @property _subtitle
    * @type {string}
    * @public
    */
    public _subtitle: string;

    /**
    * @property preload
    * @type {createjs.LoadQueue}
    * @public
    */
    public preload:createjs.LoadQueue;

    /**
    * @property events
    * @type {any[]}
    * @public
    */
    public events:any;

    constructor(assetsManifest?:string[])
    {
        //console.log("[ElearningPlayerBridge] constructor");
        //assets list manifest;
        this.manifest = assetsManifest;    

        //events list
        this.events = {};
    }
    /**
     * Start assets loading (TODO: add more initializations)
     */
    public start = ():void =>
    {
        //console.log("[ElearningPlayerBridge] start");
        this.load();
    }

    public init = ():void =>
    {
        this.onReady();

        //holding all page animations on a timeline
        this.timeline = (<any>window).TimelineLite ? (<any>window).TimelineLite.exportRoot() : null;

        //ao iniciar a página, seta o status para "playing";
        this.playing = true;        
    }

    public get sound():createjs.AbstractSoundInstance 
    {
        return this._sound;
    }

    public set sound(value:createjs.AbstractSoundInstance)
    {
        this._sound = value;
    }

    public get subtitle():string 
    {
        return this._subtitle;
    }

    public set subtitle(value:string)
    {
        this._subtitle = value;
    }
    
    /**
     * Play sounds based on id
     */
    public playSound = (id:string):void =>
    {
        this.sound = createjs.Sound.play(id);
        //console.log("[ElearningPlayerBridge] playSound", this.sound);
    }

    /**
     * Play sounds based on id
     */
    public setSubtitle = (value:string):void =>
    {
        //console.log("[ElearningPlayerBridge] setSubtitle");
        this.subtitle = value;
    }

    /**
     * Must be used to define the page custom code;
     * Users must override this method or listen to this event;
     */
    protected onReady = ():void =>
    {
        //console.log("[ElearningPlayerBridge] onReady");

        // dispatch a on_ready event.
        this.dispatchEventWith(ElearningPlayerBridge.ON_READY);
    }
        
    /**
     * Page status toggle
     */
    public togglePlayPause = ():void =>
    {
        //console.log("[ElearningPlayerBridge] togglePlayPause");

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
     * Toggle volume
     */
    public toggleVolume = ():void =>
    {
        console.log("[ElearningPlayerBridge] toggleVolume");
        if(this.sound) 
        {
            this.sound.volume = this.sound.volume == 1 ? 0 : 1;
        }
    }

    /**
     * Execute resume on animation instances (TimelineLite), sound instances (SoundJS), change page status state;
     */
    public resume = ():void =>
    {
        //console.log("[ElearningPlayerBridge] resume");

        if(this.timeline) this.timeline.resume();
        if(this.sound) this.sound.paused = false;
        this.playing = true;
    }

    /**
     * Execute pause on animation instances (TimelineLite), sound instances (SoundJS), change page status state;
     */
    public pause = ():void =>
    {
        //console.log("[ElearningPlayerBridge] pause");

        if(this.timeline) this.timeline.pause();
        if(this.sound) this.sound.paused = true;
        this.playing = false;
    }

    /**
     * Clean up;
     */
    public kill():void
    {
        this.subtitle = "";
        this.playing = false;
        
        if(this.sound) this.sound.destroy();
        if(this.timeline) this.timeline.clear();
        if(this.preload) this.preload.destroy();
    }

    /**
     * Page assets loading;
     */
    public load = ():void =>
    {
        //console.log("[ElearningPlayerBridge] load");

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
            //console.log("[ElearningPlayerBridge] load - no manifest");
            //Informa sobre o carregamento;
            this.dispatchEventWith(ElearningPlayerBridge.ON_LOAD_PROGRESS, 1);
            //this.init();
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
            this.dispatchEventWith(ElearningPlayerBridge.ON_LOAD_PROGRESS, 1);
            this.preload.off("fileload", this.handleFileLoad);
            this.preload.off("progress", this.handleOverallProgress);
            this.preload.off("error", this.handleFileError);
        }        
    }

    /**
     * Inform player about overall progress;
     */
    public handleOverallProgress =(event) :void =>
    {
        if(this.preload.progress < 1)
        {
            this.dispatchEventWith(ElearningPlayerBridge.ON_LOAD_PROGRESS, this.preload.progress);
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

    //EVENT DISPATCHER
    public addEventListener = (event:string, callback:Function):void =>
    {
        // Check if the callback is not a function
        if (typeof callback !== 'function') 
        {
            console.error(`The listener callback must be a function, the given type is ${typeof callback}`);
            return;
        }
        // Check if the event is not a string
        if (typeof event !== 'string') 
        {
            console.error(`The event name must be a string, the given type is ${typeof event}`);
            return;
        }
            
        // Create the event if not exists
        if (this.events[event] === undefined) 
        {
            this.events[event] = { listeners: [] };
        }
            
        this.events[event].listeners.push(callback);
    }

    public removeEventListener = (event:string, callback:Function):void =>
    {
        // Check if this event not exists
        if (this.events[event] === undefined) 
        {
            console.error(`This event: ${event} does not exist`);
            return;
        }
            
        this.events[event].listeners = this.events[event].listeners.filter(listener => 
        {
            return listener.toString() !== callback.toString(); 
        });
    }

    public dispatchEventWith = (event:string, details?:any):void =>
    {
        //console.log("[ElearningPlayerBridge] dispatchEventWith: ", event);

        // Check if this event not exists
        if (this.events[event] === undefined) 
        {
            console.error(`This event: ${event} does not exist`);
            return;
        }

        this.events[event].listeners.forEach((listener) => 
        {
            listener(details);
        });
    }
}


        

        

        
