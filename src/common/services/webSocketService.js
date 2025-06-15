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
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
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
        // Si ya está conectado, resolver inmediatamente
        if (this.connected && this.stompClient) {
          console.log('WebSocket ya está conectado');
          resolve();
          return;
        }

        // Limpiar cliente anterior si existe
        if (this.stompClient) {
          this.disconnect();
        }

        // Crear conexión SockJS
        const wsUrl = `${import.meta.env.VITE_API_URL}/ws`;
        console.log('Conectando a WebSocket:', wsUrl);
        const socket = new SockJS(wsUrl);

        this.stompClient = Stomp.over(socket);

        // Configuración
        this.stompClient.reconnect_delay = this.reconnectDelay;
        this.stompClient.heartbeat.outgoing = this.heartbeatOutgoing;
        this.stompClient.heartbeat.incoming = this.heartbeatIncoming;

        // Desactivar logs de debug en producción
        if (import.meta.env.PROD) {
          this.stompClient.debug = null;
        }

        // Obtener token de autenticación
        const headers = {};
        // Conectar con headers de autenticación
        this.stompClient.connect(
          headers,
          (frame) => {
            console.log('✅ WebSocket conectado:', frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            if (onConnected) onConnected(frame);
            resolve(frame);
          },
          (error) => {
            console.error('❌ Error de WebSocket:', error);
            this.connected = false;
            this.reconnectAttempts++;

            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              console.log(`Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
              setTimeout(() => {
                this.connect(onConnected, onError)
                  .then(resolve)
                  .catch(reject);
              }, this.reconnectDelay);
            } else {
              console.error('Se alcanzó el máximo de intentos de reconexión');
              if (onError) onError(error);
              reject(error);
            }
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

    // Obtener token de autenticación
    const headers = {};

    // Enviar el mensaje tal cual, sin modificar
    console.log('📤 Enviando mensaje:', {
      destination,
      headers,
      message
    });

    this.stompClient.send(
      destination,
      headers,
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