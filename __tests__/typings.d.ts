declare var global: any

interface CloudflareWorker extends Window {
    listeners: Map<string, any>
    trigger(key: string, value: any): any
}