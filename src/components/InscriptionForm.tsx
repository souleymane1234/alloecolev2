import React from 'react';

const InscriptionForm = () => {
  return (
    <div className="bg-[#12091A] text-white rounded-xl shadow-lg p-6 md:p-10 max-w-7xl mx-auto mt-10 mb-10">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-yellow-400 mb-8 uppercase">
        Inscrivez-vous !
      </h2>

      <form className="grid md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <label className="block mb-2 text-white shadow-sm">Nom</label>
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full p-3 rounded-md text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Pseudo */}
        <div>
          <label className="block mb-2 text-white shadow-sm">Pseudo</label>
          <input
            type="text"
            placeholder="Votre pseudo"
            className="w-full p-3 rounded-md text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-white shadow-sm">description de votre presentation</label>
          <textarea
            rows={3}
            placeholder=""
            className="w-full p-3 rounded-md text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          ></textarea>
        </div>

        {/* Vidéo */}
        <div>
          <label className="block mb-1 text-white shadow-sm">
            Video <span className="text-orange-500 italic text-sm">(La taille de votre vidéo ne doit pas dépasser 20 Mo.)</span>
          </label>
          <input type="file" accept="video/*" className="w-1/2 bg-gray-700 rounded-md cursor-pointer" />
        </div>

        {/* Photo */}
        <div>
          <label className="block mb-2 text-white shadow-sm">photo</label>
          <input type="file" accept="image/*" className="w-1/2 bg-gray-700 rounded-md cursor-pointer" />
        </div>

        {/* Bouton */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-8 rounded-md w-full md:w-1/3"
          >
            S’inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default InscriptionForm;
