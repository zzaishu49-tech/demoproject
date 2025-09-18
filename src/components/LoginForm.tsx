@@ .. @@
 import React, { useState } from 'react';
-import { useAuth } from '../context/AuthContext';
+import { useAuth } from '../context/SupabaseAuthContext';
 import { LogIn, User, Lock } from 'lucide-react';
 
 export function LoginForm() {
 }
@@ .. @@
           <div className="mt-8 pt-6 border-t border-gray-200">
             <p className="text-sm text-gray-600 mb-4 text-center">Demo Accounts:</p>
+            <p className="text-xs text-gray-500 mb-4 text-center">
+              Note: After connecting to Supabase, you'll need to create these accounts or use your own authentication system.
+            </p>
             <div className="space-y-2">
               <button
                 type="button"
                 onClick={() => handleDemoLogin('manager@xeetrack.com')}
                 className="w-full p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors"
               >
                 <strong>Manager:</strong> manager@xeetrack.com
               </button>
               <button
                 type="button"
                 onClick={() => handleDemoLogin('employee@xeetrack.com')}
                 className="w-full p-2 text-left bg-green-50 hover:bg-green-100 rounded-lg text-sm transition-colors"
               >
                 <strong>Employee:</strong> employee@xeetrack.com
               </button>
               <button
                 type="button"
                 onClick={() => handleDemoLogin('client@xeetrack.com')}
                 className="w-full p-2 text-left bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors"
               >
                 <strong>Client:</strong> client@xeetrack.com
               </button>
             </div>
           </div>
         </div>
       </div>