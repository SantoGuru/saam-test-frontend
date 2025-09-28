import React from 'react';
import ProductCard from './ProductCard'; // Importar o novo componente

const ProductList = ({ products, onEdit, onDelete, onAddProduct }) => {

  if (products.length === 0) {
    return (
        <div className="empty-state">
            <h3>Nenhum produto cadastrado</h3>
            <p>Comece por adicionar o seu primeiro produto à lista.</p>
            <button onClick={onAddProduct}>Adicionar Primeiro Produto</button>
        </div>
    );
  }

  return (
    <>
      {/* Layout de Tabela para Desktop */}
      <div className="table-container desktop-only">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.descricao || '-'}</td>
                <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                <td>{produto.quantidade}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(produto)} className="button-edit">Editar</button>
                    <button onClick={() => onDelete(produto)} className="button-delete">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Layout de Cards para Mobile */}
      <div className="card-container mobile-only">
        {products.map((produto) => (
          <ProductCard 
            key={produto.id}
            product={produto}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;