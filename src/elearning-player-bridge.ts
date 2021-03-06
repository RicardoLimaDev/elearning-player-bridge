/// <reference types="greensock" />
/// <reference types="createjs" />
/// <reference types="preloadjs" />
/// <reference types="soundjs" />

export class ElearningPlayerBridge 
{
    public static ON_START:string = "on_start";
    public static ON_READY:string = "on_ready";
    public static ON_LOAD_PROGRESS:string = "on_load_progress";
    public static ON_SUBTITLE:string = "on_subtitle";
    public static ON_RESUME:string = "on_resume";
    public static ON_PAUSE:string = "on_pause";
    public static ON_PAGE_FORWARD:string = "on_page_forward";
    public static ON_PAGE_BACKWARD:string = "on_page_backward";
    public static ON_PAGE_CONTENT_COMPLETE:string = "on_page_content_complete";
    public static ON_PAGE_SET_SCORE:string = "on_page_set_score";

    public static ON_PAGE_SET_INTERACTION_ID:string = "on_page_set_interaction_id";
    public static ON_PAGE_SET_INTERACTION_CORRECT_RESPONSE:string = "on_page_set_interaction_correct_response";
    public static ON_PAGE_SET_INTERACTION_RESULT:string = "on_page_set_interaction_result";
    public static ON_PAGE_SET_INTERACTION_STUDENT_RESPONSE:string = "on_page_set_interaction_student_response";
    public static ON_PAGE_SET_INTERACTION_TYPE:string = "on_page_set_interaction_type";
    public static ON_PAGE_SET_INTERACTION_LATENCY:string = "on_page_set_interaction_latency";
    public static ON_PAGE_SET_INTERACTION_TIME:string = "on_page_set_interaction_time";
    public static ON_PAGE_SET_INTERACTION_OBJECTIVES:string = "on_page_set_interaction_objectives";
    public static ON_PAGE_SET_INTERACTION_WEIGHT:string = "on_page_set_interaction_weight";

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

    /**
    * @property initiated
    * @type {boolean}
    * @public
    */
    public initiated:boolean;
    

    constructor(assetsManifest?:string[])
    {
        //console.log("[ElearningPlayerBridge] constructor");
        //assets list manifest;
        this.manifest = assetsManifest;    

        //events list
        this.events = {};

        this.volume = 1;

        this.playing = false;
    }
    /**
     * Start assets loading (TODO: add more initializations)
     */
    public start = ():void =>
    {
        //console.log("[ElearningPlayerBridge] start");
        this.dispatchEventWith(ElearningPlayerBridge.ON_START);
        this.load();
    }

    /**
    * Dispatch ON_READY event and set the TimelineMax instance;
    */
    public init = ():void =>
    {
        this.onReady();
        this.updateTimelineInstance();
    }

    /**
    * Dispatch ON_PAGE_FORWARD event;
    */
    public setPageForward = ():void =>
    {
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_FORWARD);
    }

    /**
    * Dispatch ON_PAGE_BACKWARD event;
    */
    public setPageBackward = ():void =>
    {
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_BACKWARD);
    }

    /**
    * Dispatch ON_PAGE_CONTENT_COMPLETE event;
    */
    public setPageContentComplete = ():void =>
    {
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_CONTENT_COMPLETE);
    }

    /**
    * Dispatch ON_PAGE_SET_SCORE event;
    */
    public setPageScore = (value:number):void =>
    {
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_SCORE, {score:value});
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_ID event;
    */
    public setInteractionId = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_ID, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_CORRECT_RESPONSE event;
    */
    public setInteractionCorrectResponse = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_CORRECT_RESPONSE, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_RESULT event;
    */
    public setInteractioResult = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_RESULT, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_STUDENT_RESPONSE event;
    */
    public setInteractionStudentResponse = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_STUDENT_RESPONSE, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_TYPE event;
    */
    public setInteractionType = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_TYPE, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_LATENCY event;
    */
    public setInteractionLatency = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_LATENCY, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_TIME event;
    */
    public setInteractionTime = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_TIME, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_OBJECTIVES event;
    */
    public setInteractionObjectives = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_OBJECTIVES, data);
    }

    /**
    * Dispatch ON_PAGE_SET_INTERACTION_WEIGHT event;
    */
    public setInteractionWeight = (n:number, value:string):void =>
    {
        var data:any={};
        data.n = n;
        data.data = value;
        this.dispatchEventWith(ElearningPlayerBridge.ON_PAGE_SET_INTERACTION_WEIGHT, data);
    }    

    /**
    * To keep the timeline instance always in sync with all the TimelineLite/TweenMax instances;
    */
    private updateTimelineInstance = ():void=>
    {
        //holding all page animations on a timeline
        this.timeline = (<any>window).TimelineLite ? (<any>window).TimelineLite.exportRoot() : null;
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
        //console.log("[ElearningPlayerBridge] togglePlayPause - this.playing", this.playing);

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
        if(!this.initiated)
        {
            this.initiated = true;
            this.init();
        }

        if(this.timeline) 
        {
            this.timeline.resume();
        }

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
            this.preload.on("fileload", this.handleFileLoad );
            this.preload.on("progress", this.handleOverallProgress);
            this.preload.on("error", this.handleFileError);

            while (this.manifest.length > 0) { this.loadAnother(); }
        }
        else
        {
            //Informa sobre o carregamento;
            this.dispatchEventWith(ElearningPlayerBridge.ON_LOAD_PROGRESS, 1);
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
        /*
        console.log("file loaded: ", event.item.id);

        var item = event.item;
        switch (item.type) 
        {
            case "sound":
            break;

            case "image":
            break;
        }
        console.log("file loaded result: ", event.result);
        */
        
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
            //console.log(`This event: ${event} does not exist`);
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
            //console.log(`This event: ${event} does not exist`);
            return;
        }

        this.events[event].listeners.forEach((listener) => 
        {
            listener(details);
        });
    }
}


        

        

        
