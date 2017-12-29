/// <reference types="greensock" />
/// <reference types="createjs" />
/// <reference types="preloadjs" />
/// <reference types="soundjs" />

export class ElearningPlayerBridge 
{
    public static ON_READY:string = "on_ready";
    public static ON_LOAD_PROGRESS:string = "on_load_progress";
    public static ON_SUBTITLE:string = "on_subtitle";
    public static ON_RESUME:string = "on_resume";
    public static ON_PAUSE:string = "on_pause";

    public static ON_SOUND_VOLUME_CHANGE:string = "on_sound_volume_change";
    public static ON_SOUND_STATE_CHANGE:string = "on_sound_state_change";
    public static ON_SOUND_DESTROY:string = "on_sound_destroy";


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
    private _sound: createjs.AbstractSoundInstance;

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

    /**
    * @property volume
    * @type {number}
    * @public
    */
    public volume:number;

    /**
    * @property deviceInfo
    * @type {any}
    * @public
    */
    public deviceInfo:any;
    

    constructor(assetsManifest?:string[])
    {
        //console.log("[ElearningPlayerBridge] constructor");
        //assets list manifest;
        this.manifest = assetsManifest;    

        //events list
        this.events = {};

        this.volume = 1;
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

        this.updateTimelineInstance();

        //ao iniciar a página, seta o status para "playing";
        this.playing = true;
    }

    private updateTimelineInstance = ():void=>
    {
        //holding all page animations on a timeline
        this.timeline = (<any>window).TimelineLite ? (<any>window).TimelineLite.exportRoot() : null;
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
        this.sound.volume = this.volume;
        this.dispatchEventWith(ElearningPlayerBridge.ON_SOUND_STATE_CHANGE);
    }

    /**
     * Play sounds based on id
     */
    public setSubtitle = (value:string):void =>
    {
        //console.log("[ElearningPlayerBridge] setSubtitle");
        this.subtitle = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_SUBTITLE, value);
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
        //console.log("[ElearningPlayerBridge] toggleVolume");
        if(this.sound) 
        {
            this.sound.volume = this.sound.volume == 1 ? 0 : 1;
            this.volume = this.sound.volume;
            this.dispatchEventWith(ElearningPlayerBridge.ON_SOUND_VOLUME_CHANGE);
        }
    }

    /**
     * Execute resume on animation instances (TimelineLite), sound instances (SoundJS), change page status state;
     */
    public resume = ():void =>
    {
        //console.log("[ElearningPlayerBridge] resume");

        if(this.timeline) this.timeline.resume();
        if(this.sound)
        {
            this.sound.paused = false;
            this.dispatchEventWith(ElearningPlayerBridge.ON_SOUND_STATE_CHANGE);
        } 
        this.playing = true;

        this.dispatchEventWith(ElearningPlayerBridge.ON_RESUME);
    }

    /**
     * Execute pause on animation instances (TimelineLite), sound instances (SoundJS), change page status state;
     */
    public pause = ():void =>
    {
        //console.log("[ElearningPlayerBridge] pause");

        this.updateTimelineInstance();

        if(this.timeline) this.timeline.pause();
        if(this.sound)
        {
            this.sound.paused = true;
            this.dispatchEventWith(ElearningPlayerBridge.ON_SOUND_STATE_CHANGE);
        }
        this.playing = false;

        this.dispatchEventWith(ElearningPlayerBridge.ON_PAUSE);
    }

    /**
     * Clean up;
     */
    public kill():void
    {
        this.subtitle = "";
        this.playing = false;
        
        if(this.sound) 
        {
            this.sound.destroy();
            this.dispatchEventWith(ElearningPlayerBridge.ON_SOUND_DESTROY);
        }
        if(this.timeline) this.timeline.clear();
        if(this.preload) this.preload.destroy();
    }

    /**
     * Page assets loading;
     */
    public load = ():void =>
    {
        if(this.manifest && this.manifest.length > 0)
        {
            this.preload = new createjs.LoadQueue(true);
            this.preload.installPlugin(createjs.Sound); 
            this.preload.on("fileload", this.handleFileLoad);
            this.preload.on("progress", this.handleOverallProgress);
            this.preload.on("error", this.handleFileError);

            while (this.manifest.length > 0) { this.loadAnother(); }
        }
        else
        {
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
            console.log(`The listener callback must be a function, the given type is ${typeof callback}`);
            return;
        }
        // Check if the event is not a string
        if (typeof event !== 'string') 
        {
            console.log(`The event name must be a string, the given type is ${typeof event}`);
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
            console.log(`This event: ${event} does not exist`);
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
            console.log(`This event: ${event} does not exist`);
            return;
        }

        this.events[event].listeners.forEach((listener) => 
        {
            listener(details);
        });
    }
}


        

        

        
