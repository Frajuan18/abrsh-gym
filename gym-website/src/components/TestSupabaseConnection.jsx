import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test connection by fetching from users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      if (error) {
        setConnectionStatus(`Error: ${error.message}`);
      } else {
        setConnectionStatus(`✅ Connected! Found ${data?.length || 0} users`);
        setTableData(data);
      }
    } catch (error) {
      setConnectionStatus(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <h3 className="font-bold mb-2">Supabase Connection Test</h3>
      <p className="mb-2">Status: {connectionStatus}</p>
      <button 
        onClick={testConnection}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Again
      </button>
      
      {tableData && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Sample Data:</h4>
          <pre className="text-sm bg-white p-2 rounded overflow-auto">
            {JSON.stringify(tableData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestConnection;