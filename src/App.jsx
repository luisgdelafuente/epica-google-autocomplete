import React, { useState } from 'react';
import { GoogleAutocomplete } from './autocomplete';

const COUNTRIES = [
  { code: 'es', name: 'Spain' },
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'it', name: 'Italy' },
  { code: 'pt', name: 'Portugal' },
  { code: 'mx', name: 'Mexico' },
  { code: 'ar', name: 'Argentina' },
  { code: 'cl', name: 'Chile' }
];

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' }
];

const FloatingIcon = ({ children, className }) => (
  <div className={`absolute animate-float opacity-20 ${className}`}>
    {children}
  </div>
);

function App() {
  const [terms, setTerms] = useState(['']);
  const [country, setCountry] = useState('es');
  const [language, setLanguage] = useState('es');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const addTerm = () => {
    setTerms([...terms, '']);
  };

  const removeTerm = (index) => {
    const newTerms = terms.filter((_, i) => i !== index);
    setTerms(newTerms);
  };

  const updateTerm = (index, value) => {
    const newTerms = [...terms];
    newTerms[index] = value;
    setTerms(newTerms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const autocomplete = new GoogleAutocomplete();
      const allSuggestions = new Map();

      for (const term of terms) {
        if (term.trim()) {
          const suggestions = await autocomplete.getSuggestions(term, country, language);
          suggestions.forEach((suggestion, index) => {
            const weight = (suggestions.length - index) / suggestions.length;
            if (allSuggestions.has(suggestion)) {
              allSuggestions.set(suggestion, allSuggestions.get(suggestion) + weight);
            } else {
              allSuggestions.set(suggestion, weight);
            }
          });
        }
      }

      const sortedResults = [...allSuggestions.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25)
        .map(([term, weight], index) => ({
          rank: index + 1,
          term,
          weight: weight.toFixed(3)
        }));

      setResults(sortedResults);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (key) => {
    setSortConfig((prevConfig) => {
      const direction = 
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
      
      const sortedResults = [...results].sort((a, b) => {
        if (key === 'rank' || key === 'weight') {
          return direction === 'asc' 
            ? parseFloat(a[key]) - parseFloat(b[key])
            : parseFloat(b[key]) - parseFloat(a[key]);
        }
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });

      setResults(sortedResults);
      return { key, direction };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100 relative overflow-hidden">
      <FloatingIcon className="top-20 left-[10%]">
        <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"/>
          <path d="M3 5h12a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z"/>
        </svg>
      </FloatingIcon>
      <FloatingIcon className="top-40 right-[15%]">
        <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM10.622 8.415a.4.4 0 00-.622.332v6.506a.4.4 0 00.622.332l4.879-3.252a.4.4 0 000-.666l-4.879-3.252z"/>
        </svg>
      </FloatingIcon>
      <FloatingIcon className="bottom-32 left-[20%]">
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168.167.275.336.541.516.797l.119.175.027.038.018.025.006.009A9.944 9.944 0 0012 22c2.25 0 4.33-.744 6-2l.004-.003.027-.02.074-.054c.172-.13.338-.267.498-.412l.056-.05.005-.004A9.946 9.946 0 0022 12c0-5.523-4.477-10-10-10zm-1 16.5v-2a2 2 0 012-2h2a2 2 0 012 2v2a7.94 7.94 0 01-3 .584c-.693 0-1.365-.097-2-.278zM7 12a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </FloatingIcon>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="text-blue-400">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v1h14zm0 2H5v11a2 2 0 002 2h10a2 2 0 002-2V8zM9 4h6v2H9V4zM8 12h3v2H8v-2zm5 0h3v2h-3v-2zm-5 4h3v2H8v-2zm5 0h3v2h-3v-2z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Google Suggestions Tool Branch2
          </h1>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700/50 p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-base font-medium text-gray-300 mb-4">
                Topics (2-3 keywords)
              </label>
              
              {terms.map((term, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => updateTerm(index, e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      placeholder="Enter keyword"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  {index === terms.length - 1 ? (
                    <button
                      type="button"
                      onClick={addTerm}
                      className="p-2 text-blue-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeTerm(index)}
                      className="p-2 text-gray-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600/50 text-gray-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none"
                  >
                    {COUNTRIES.map(({ code, name }) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/50 border border-gray-600/50 text-gray-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none"
                  >
                    {LANGUAGES.map(({ code, name }) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : 'Analyze Keywords'}
            </button>
          </form>
        </div>

        {results.length > 0 && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead>
                <tr className="bg-gray-900/50">
                  {[
                    { key: 'rank', label: 'Rank' },
                    { key: 'term', label: 'Suggestion' },
                    { key: 'weight', label: 'Weight' }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => sortResults(key)}
                      className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition-colors"
                    >
                      {label} {getSortIcon(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {results.map((result) => (
                  <tr key={result.term} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {result.rank}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100">
                      {result.term}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {result.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
