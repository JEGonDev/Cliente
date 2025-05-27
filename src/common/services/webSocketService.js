import SockJS from 'sockjs-client';
import { Stomp } from 'stompjs/lib/stomp.js';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectDelay = 5000;
    this.heartbeatIncoming = 10000;
    this.heartbeatOutgoing = 10000;
  }

  /**
   * Conecta al servidor WebSocket
   * @param {Function} onConnected - Callback cuando se conecta exitosamente
   * @param {Function} onError - Callback cuando hay un error
   * @returns {Promise<void>}
   */
  connect(onConnected, onError) {
    return new Promise((resolve, reject) => {
      try {
        // Crear conexión SockJS
        const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws`);
        this.stompClient = Stomp.over(socket);
        
        // Configuración
        this.stompClient.reconnect_delay = this.reconnectDelay;
        this.stompClient.heartbeat.outgoing = this.heartbeatOutgoing;
        this.stompClient.heartbeat.incoming = this.heartbeatIncoming;
        
        // Desactivar logs de debug en producción
        if (import.meta.env.PROD) {
          this.stompClient.debug = null;
        }
        
        // Conectar (autenticación por cookie)
        this.stompClient.connect(
          {}, // Headers vacíos - la autenticación va por cookie
          (frame) => {
            console.log('✅ WebSocket conectado:', frame);
            this.connected = true;
            if (onConnected) onConnected(frame);
            resolve(frame);
          },
          (error) => {
            console.error('❌ Error de WebSocket:', error);
            this.connected = false;
            if (onError) onError(error);
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ Error al crear conexión WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Suscribe a un topic específico
   * @param {string} topic - El topic al que suscribirse
   * @param {Function} callback - Función a ejecutar cuando llega un mensaje
   * @returns {string} - ID de la suscripción
   */
  subscribe(topic, callback) {
    if (!this.stompClient || !this.connected) {
      console.error('❌ WebSocket no está conectado');
      return null;
    }

    const subscription = this.stompClient.subscribe(topic, (message) => {
      try {
        const payload = JSON.parse(message.body);
        callback(payload);
      } catch (error) {
        console.error('❌ Error procesando mensaje:', error);
        callback(message.body); // Enviar el mensaje raw si no es JSON
      }
    });

    // Guardar la suscripción para poder cancelarla después
    const subscriptionId = subscription.id;
    this.subscriptions.set(subscriptionId, subscription);
    
    return subscriptionId;
  }

  /**
   * Cancela una suscripción específica
   * @param {string} subscriptionId - ID de la suscripción a cancelar
   */
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
    }
  }

  /**
   * Envía un mensaje a un destino específico
   * @param {string} destination - Destino del mensaje
   * @param {Object} message - Mensaje a enviar
   */
  send(destination, message) {
    if (!this.stompClient || !this.connected) {
      console.error('❌ WebSocket no está conectado');
      return;
    }

    this.stompClient.send(
      destination,
      {},
      typeof message === 'object' ? JSON.stringify(message) : message
    );
  }

  /**
   * Desconecta del servidor WebSocket
   */
  disconnect() {
    if (this.stompClient && this.connected) {
      // Cancelar todas las suscripciones
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      
      // Desconectar
      this.stompClient.disconnect(() => {
        console.log('🔌 WebSocket desconectado');
        this.connected = false;
      });
    }
  }

  /**
   * Verifica si está conectado
   * @returns {boolean}
   */
  isConnected() {
    return this.connected;
  }
}

// Exportar instancia única (Singleton)
export const websocketService = new WebSocketService();