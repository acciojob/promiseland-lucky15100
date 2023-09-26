class CustomPromise {
    constructor(executor) {
        this.state = 'pending'; // Initial state is pending
        this.value = undefined; // Value when resolved
        this.reason = undefined; // Reason when rejected
        this.fulfillHandlers = [];
        this.rejectHandlers = [];
        this.finallyHandler = null;

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.fulfillHandlers.forEach(handler => handler(this.value));
                if (this.finallyHandler) {
                    this.finallyHandler();
                }
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.rejectHandlers.forEach(handler => handler(this.reason));
                if (this.finallyHandler) {
                    this.finallyHandler();
                }
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        if (this.state === 'fulfilled') {
            onFulfilled(this.value);
        } else if (this.state === 'rejected') {
            onRejected(this.reason);
        } else {
            this.fulfillHandlers.push(onFulfilled);
            this.rejectHandlers.push(onRejected);
        }

        return this; // Return the promise for chaining
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        this.finallyHandler = onFinally;
        return this; // Return the promise for chaining
    }
}

window.CustomPromise = CustomPromise;
