dtavm = {}
dtavm.log = console.log
dtavm.proxy = function (obj, objname, type){
    function getMethodHandler(WatchName, target_obj) {
    let methodhandler = {
        apply(target, thisArg, argArray) {
			if (this.target_obj){
				thisArg = this.target_obj
			}
            let result = Reflect.apply(target, thisArg, argArray)
            if (target.name !== "toString"){
                if (target.name === "addEventListener"){
                    dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is [${argArray[0]}], result is [${result}].`)
                }else if (WatchName === "window.console"){
                }else {
                    dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is [${argArray}], result is [${result}].`)
                }
            }else{
                dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is [${argArray}], result is [${result}].`)
            }
			return result
        },
        construct(target, argArray, newTarget) {
            var result = Reflect.construct(target, argArray, newTarget)
            dtavm.log(`[${WatchName}] construct function name is [${target.name}], argArray is [${argArray}], result is [${(result)}].`)
            return result;
        }
    }
	methodhandler.target_obj = target_obj
    return methodhandler
}

    function getObjhandler(WatchName) {
    let handler = {
        get(target, propKey, receiver) {
            let result = target[propKey]
            if (result instanceof Object) {
                if (typeof result === "function") {
                    dtavm.log(`[${WatchName}] getting propKey is [${propKey}] , it is function`)
                    return new Proxy(result,getMethodHandler(WatchName, target))
                }
                else {
                    dtavm.log(`[${WatchName}] getting propKey is [${propKey}], result is [${(result)}]`);
                }
                return new Proxy(result, getObjhandler(`${WatchName}.${propKey}`))
            }
            if(typeof(propKey) !== "symbol"){
                dtavm.log(`[${WatchName}] getting propKey is [${propKey?.description ?? propKey}], result is [${result}]`);
            }
            return result;
        },
        set(target, propKey, value, receiver) {
            if (value instanceof Object) {
                dtavm.log(`[${WatchName}] setting propKey is [${propKey}], value is [${(value)}]`);
            } else {
                dtavm.log(`[${WatchName}] setting propKey is [${propKey}], value is [${value}]`);
            }
            return Reflect.set(target, propKey, value, receiver);
        },
        has(target, propKey) {
            var result = Reflect.has(target, propKey);
            dtavm.log(`[${WatchName}] has propKey [${propKey}], result is [${result}]`)
            return result;
        },
        deleteProperty(target, propKey) {
            var result = Reflect.deleteProperty(target, propKey);
            dtavm.log(`[${WatchName}] delete propKey [${propKey}], result is [${result}]`)
            return result;
        },
        defineProperty(target, propKey, attributes) {
            var result = Reflect.defineProperty(target, propKey, attributes);
            dtavm.log(`[${WatchName}] defineProperty propKey [${propKey}] attributes is [${(attributes)}], result is [${result}]`)
            return result
        },
        getPrototypeOf(target) {
            var result = Reflect.getPrototypeOf(target)
            dtavm.log(`[${WatchName}] getPrototypeOf result is [${(result)}]`)
            return result;
        },
        setPrototypeOf(target, proto) {
            dtavm.log(`[${WatchName}] setPrototypeOf proto is [${(proto)}]`)
            return Reflect.setPrototypeOf(target, proto);
        },
        preventExtensions(target) {
            dtavm.log(`[${WatchName}] preventExtensions`)
            return Reflect.preventExtensions(target);
        },
        isExtensible(target) {
            var result = Reflect.isExtensible(target)
            dtavm.log(`[${WatchName}] isExtensible, result is [${result}]`)
            return result;
        },
    }
    return handler;
}

    if (type === "method"){
        return new Proxy(obj, getMethodHandler(objname, obj));
    }
    return new Proxy(obj, getObjhandler(objname));
}

Object.defineProperties(globalThis, {
    'window': {
        configurable: false,
        enumerable: true,
        get: function get() {
            return dtavm.proxy(window_dta, "window")
        },
        set: undefined
    },
    'navigator': {
        configurable: true,
        enumerable: true,
        get: function get() {
            return dtavm.proxy(navigator_dta, "navigator")
        },
        set: undefined
    },
	'document': {
        configurable: false,
        enumerable: true,
        get: function get() {
            return dtavm.proxy(document_dta, "document")
        },
        set: undefined
    },
	'history': {
        configurable: true,
        enumerable: true,
        get: function get() {
            return dtavm.proxy(history_dta, "history")
        },
        set: undefined
    },
})
screen = dtavm.proxy(screen_dta, "screen")