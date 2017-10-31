export class EventDispatcher 
{

    /**
    * @property events
    * @type {any[]}
    * @public
    */
    public events:any;

    constructor()
    {
        this.events = {};
    }
    
    public addEventListener(event:string, callback:Function):void
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

    public removeEventListener(event:string, callback:Function):void
    {
        // Check if this event not exists
        if (this.events[event] === undefined) 
        {
            console.error(`This event: ${event} does not exist`);
            return;
        }
            
        this.events[event].listeners = this.events[event].listeners.filter(listener => {
            return listener.toString() !== callback.toString(); 
        });
    }

    public dispatchEventWith(event:string, details?:any):void
    {
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


        

        

        
