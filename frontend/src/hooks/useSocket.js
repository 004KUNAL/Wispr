import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addLivePost } from '../store/slices/postSlice';
import { addLiveNotification } from '../store/slices/notificationSlice';

let socket = null;

export const useSocket = () => {
  const { token, user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    socket = io('http://localhost:5000', { auth: { token }, transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_feed');
    });

    socket.on('feed_post', (post) => {
      dispatch(addLivePost(post));
    });

    socket.on('notification', (notification) => {
      dispatch(addLiveNotification(notification));
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token]);

  return socketRef.current;
};

export const getSocket = () => socket;
