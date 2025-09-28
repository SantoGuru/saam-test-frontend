import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <div className="card-header">
        <h4 className="card-title">{product.nome}</h4>
        <div className="action-buttons">
          <button onClick={() => onEdit(product)} className="button-edit">Editar</button>
          <button onClick={() => onDelete(product)} className="button-delete">Excluir</button>
        </div>
      </div>
      <div className="card-body">
        <p className="card-description">{product.descricao || 'Sem descrição.'}</p>
        <div className="card-details">
          <span><strong>Preço:</strong> R$ {parseFloat(product.preco).toFixed(2)}</span>
          <span><strong>Qtd:</strong> {product.quantidade}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;