import React from 'react';
import { CheckCircle, Circle, MapPin, Clock } from 'lucide-react';
import { TrackingEvent, getStatusColor, getStatusIcon } from '../../types/tracking';

interface OrderTimelineProps {
  events: TrackingEvent[];
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  const formatDate = (timestamp: string): string => {
    if (!timestamp) return 'Pendiente';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-1">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const color = getStatusColor(event.status);

        return (
          <div key={event.id} className="relative">
            {/* Línea conectora */}
            {!isLast && (
              <div 
                className="absolute left-6 top-12 w-0.5 h-full -ml-px"
                style={{ 
                  backgroundColor: event.isCompleted ? color : '#E5E7EB',
                  opacity: event.isCompleted ? 0.3 : 0.2
                }}
              />
            )}

            {/* Evento */}
            <div className={`flex gap-4 pb-8 ${event.isCompleted ? '' : 'opacity-50'}`}>
              {/* Icono */}
              <div className="relative flex-shrink-0">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                  style={{ 
                    backgroundColor: event.isCompleted ? color + '20' : 'white',
                    borderColor: event.isCompleted ? color : '#E5E7EB'
                  }}
                >
                  {event.isCompleted ? (
                    <CheckCircle 
                      className="w-6 h-6" 
                      style={{ color }} 
                    />
                  ) : (
                    <Circle 
                      className="w-6 h-6 text-gray-300" 
                    />
                  )}
                </div>
                {/* Emoji del estado */}
                <div 
                  className="absolute -top-1 -right-1 text-lg"
                  style={{ fontSize: '1.25rem' }}
                >
                  {getStatusIcon(event.status)}
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 
                    className={`${event.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}
                  >
                    {event.title}
                  </h3>
                  {event.timestamp && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="whitespace-nowrap">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  )}
                </div>

                <p className={`text-sm mb-2 ${event.isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {event.description}
                </p>

                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
