import { Storage } from '../../../storage/Storage';

/**
 * Utilidades para gestionar el almacenamiento de notificaciones
 * Útil para migración, limpieza y debugging
 */
export const NotificationsStorageUtils = {
  
  /**
   * Obtiene todas las claves de notificaciones en localStorage
   * @returns {Array<string>} Array de claves de notificaciones
   */
  getAllNotificationKeys() {
    try {
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('notifications_user_')) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Error al obtener claves de notificaciones:', error);
      return [];
    }
  },

  /**
   * Obtiene todas las notificaciones de todos los usuarios
   * @returns {Object} Objeto con userId como clave y notificaciones como valor
   */
  getAllStoredNotifications() {
    const keys = this.getAllNotificationKeys();
    const allNotifications = {};

    keys.forEach(key => {
      try {
        const userId = key.replace('notifications_user_', '');
        const notifications = Storage.get(key);
        if (Array.isArray(notifications)) {
          allNotifications[userId] = notifications;
        }
      } catch (error) {
        console.error(`Error al cargar notificaciones para ${key}:`, error);
      }
    });

    return allNotifications;
  },

  /**
   * Obtiene estadísticas de almacenamiento de notificaciones
   * @returns {Object} Estadísticas del almacenamiento
   */
  getStorageStats() {
    const allNotifications = this.getAllStoredNotifications();
    const stats = {
      totalUsers: 0,
      totalNotifications: 0,
      totalUnread: 0,
      userStats: {},
      categoriesCount: {},
      oldestNotification: null,
      newestNotification: null
    };

    Object.entries(allNotifications).forEach(([userId, notifications]) => {
      stats.totalUsers++;
      const userNotifications = notifications.length;
      const userUnread = notifications.filter(n => !n.read).length;
      
      stats.totalNotifications += userNotifications;
      stats.totalUnread += userUnread;
      
      stats.userStats[userId] = {
        total: userNotifications,
        unread: userUnread
      };

      // Contar categorías
      notifications.forEach(n => {
        if (!stats.categoriesCount[n.category]) {
          stats.categoriesCount[n.category] = 0;
        }
        stats.categoriesCount[n.category]++;

        // Encontrar notificación más antigua y más nueva
        const notificationDate = new Date(n.timestamp);
        if (!stats.oldestNotification || notificationDate < new Date(stats.oldestNotification.timestamp)) {
          stats.oldestNotification = n;
        }
        if (!stats.newestNotification || notificationDate > new Date(stats.newestNotification.timestamp)) {
          stats.newestNotification = n;
        }
      });
    });

    return stats;
  },

  /**
   * Limpia las notificaciones de un usuario específico
   * @param {string|number} userId - ID del usuario
   * @returns {boolean} true si se limpió correctamente
   */
  clearUserNotifications(userId) {
    try {
      const key = `notifications_user_${userId}`;
      Storage.remove(key);
      console.log(`🗑️ Limpiadas notificaciones del usuario ${userId}`);
      return true;
    } catch (error) {
      console.error(`Error al limpiar notificaciones del usuario ${userId}:`, error);
      return false;
    }
  },

  /**
   * Limpia todas las notificaciones de todos los usuarios
   * ⚠️ USAR CON PRECAUCIÓN - Esto elimina todas las notificaciones
   * @returns {number} Número de usuarios limpiados
   */
  clearAllNotifications() {
    const keys = this.getAllNotificationKeys();
    let clearedCount = 0;

    keys.forEach(key => {
      try {
        Storage.remove(key);
        clearedCount++;
      } catch (error) {
        console.error(`Error al limpiar ${key}:`, error);
      }
    });

    console.log(`🗑️ Limpiadas notificaciones de ${clearedCount} usuarios`);
    return clearedCount;
  },

  /**
   * Limpia notificaciones más antigas que X días
   * @param {number} days - Número de días
   * @returns {Object} Estadísticas de limpieza
   */
  clearOldNotifications(days = 30) {
    const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    const allNotifications = this.getAllStoredNotifications();
    const cleanupStats = {
      usersProcessed: 0,
      notificationsRemoved: 0,
      notificationsKept: 0
    };

    Object.entries(allNotifications).forEach(([userId, notifications]) => {
      const filteredNotifications = notifications.filter(n => {
        const notificationDate = new Date(n.timestamp);
        if (notificationDate < cutoffDate) {
          cleanupStats.notificationsRemoved++;
          return false;
        } else {
          cleanupStats.notificationsKept++;
          return true;
        }
      });

      // Solo actualizar si se eliminaron notificaciones
      if (filteredNotifications.length !== notifications.length) {
        const key = `notifications_user_${userId}`;
        Storage.set(key, filteredNotifications);
        cleanupStats.usersProcessed++;
      }
    });

    console.log(`🧹 Limpieza completada:`, cleanupStats);
    return cleanupStats;
  },

  /**
   * Migra notificaciones de un formato anterior (si es necesario)
   * @param {Function} migrationFunction - Función de migración personalizada
   * @returns {Object} Resultado de la migración
   */
  migrateNotifications(migrationFunction) {
    const allNotifications = this.getAllStoredNotifications();
    const migrationStats = {
      usersProcessed: 0,
      notificationsMigrated: 0,
      errors: []
    };

    Object.entries(allNotifications).forEach(([userId, notifications]) => {
      try {
        const migratedNotifications = notifications.map(migrationFunction);
        const key = `notifications_user_${userId}`;
        Storage.set(key, migratedNotifications);
        
        migrationStats.usersProcessed++;
        migrationStats.notificationsMigrated += migratedNotifications.length;
      } catch (error) {
        migrationStats.errors.push({
          userId,
          error: error.message
        });
      }
    });

    console.log('📦 Migración completada:', migrationStats);
    return migrationStats;
  },

  /**
   * Exporta todas las notificaciones para backup
   * @returns {Object} Backup de todas las notificaciones
   */
  exportNotifications() {
    const allNotifications = this.getAllStoredNotifications();
    const backup = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: allNotifications,
      stats: this.getStorageStats()
    };

    console.log('📤 Notificaciones exportadas:', backup.stats);
    return backup;
  },

  /**
   * Importa notificaciones desde un backup
   * @param {Object} backup - Backup de notificaciones
   * @returns {Object} Resultado de la importación
   */
  importNotifications(backup) {
    const importStats = {
      usersImported: 0,
      notificationsImported: 0,
      errors: []
    };

    if (!backup.data) {
      throw new Error('Formato de backup inválido');
    }

    Object.entries(backup.data).forEach(([userId, notifications]) => {
      try {
        const key = `notifications_user_${userId}`;
        Storage.set(key, notifications);
        
        importStats.usersImported++;
        importStats.notificationsImported += notifications.length;
      } catch (error) {
        importStats.errors.push({
          userId,
          error: error.message
        });
      }
    });

    console.log('📥 Notificaciones importadas:', importStats);
    return importStats;
  },

  /**
   * Valida la consistencia de las notificaciones almacenadas
   * @returns {Object} Resultado de la validación
   */
  validateStoredNotifications() {
    const allNotifications = this.getAllStoredNotifications();
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      stats: {
        totalNotifications: 0,
        validNotifications: 0,
        invalidNotifications: 0
      }
    };

    Object.entries(allNotifications).forEach(([userId, notifications]) => {
      if (!Array.isArray(notifications)) {
        validation.isValid = false;
        validation.errors.push(`Usuario ${userId}: notificaciones no es un array`);
        return;
      }

      notifications.forEach((notification, index) => {
        validation.stats.totalNotifications++;

        // Validar estructura básica
        if (!notification.id) {
          validation.isValid = false;
          validation.errors.push(`Usuario ${userId}, notificación ${index}: falta ID`);
          validation.stats.invalidNotifications++;
          return;
        }

        if (!notification.message) {
          validation.warnings.push(`Usuario ${userId}, notificación ${notification.id}: falta message`);
        }

        if (!notification.timestamp) {
          validation.warnings.push(`Usuario ${userId}, notificación ${notification.id}: falta timestamp`);
        }

        if (!notification.category) {
          validation.warnings.push(`Usuario ${userId}, notificación ${notification.id}: falta category`);
        }

        validation.stats.validNotifications++;
      });
    });

    console.log('✅ Validación completada:', validation.stats);
    return validation;
  }
};

// Funciones de conveniencia para usar en la consola del navegador
if (typeof window !== 'undefined') {
  window.NotificationsDebug = {
    stats: () => NotificationsStorageUtils.getStorageStats(),
    clear: (userId) => NotificationsStorageUtils.clearUserNotifications(userId),
    clearAll: () => NotificationsStorageUtils.clearAllNotifications(),
    export: () => NotificationsStorageUtils.exportNotifications(),
    validate: () => NotificationsStorageUtils.validateStoredNotifications(),
    cleanOld: (days) => NotificationsStorageUtils.clearOldNotifications(days)
  };
}