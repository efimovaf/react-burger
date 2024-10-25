import React from 'react';
import style from './modal-overlay.module.scss';

interface IModalOverlay {
	onClose(): void;
}

const ModalOverlay: React.FC<IModalOverlay> = ({ onClose }) => {
	return <div className={style.main} role='presentation' onClick={onClose} />;
};

export default ModalOverlay;
