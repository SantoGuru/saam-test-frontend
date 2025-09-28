import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onRequestClose, onFormSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: ''
  });
  const isEditing = !!product;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        nome: product.nome,
        descricao: product.descricao || '',
        preco: product.preco,
        quantidade: product.quantidade,
      });
    }
  }, [product, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = isEditing ? { ...formData, id: product.id } : formData;
    onFormSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
      <input
        type="text" name="nome" value={formData.nome} onChange={handleChange}
        placeholder="Nome do produto" required disabled={isLoading}
      />
      <input
        type="text" name="descricao" value={formData.descricao} onChange={handleChange}
        placeholder="Descrição" disabled={isLoading}
      />
      <input
        type="number" name="preco" value={formData.preco} onChange={handleChange}
        placeholder="Preço" required step="0.01" disabled={isLoading}
      />
      <input
        type="number" name="quantidade" value={formData.quantidade} onChange={handleChange}
        placeholder="Quantidade" required disabled={isLoading}
      />
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onRequestClose} className="button-secondary" disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? (isEditing ? 'A Salvar...' : 'A Cadastrar...') : (isEditing ? 'Salvar Alterações' : 'Cadastrar')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;