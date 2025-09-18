@@ .. @@
 export function ProjectModal({ isOpen, onClose, project, employees }: ProjectModalProps) {
   const { user } = useAuth();
   const { createProject, updateProject } = useData();
   
   const [formData, setFormData] = useState({
     title: project?.title || '',
     description: project?.description || '',
     client_id: project?.client_id || '3', // Default to demo client
     client_name: project?.client_name || 'Priya Sharma',
     deadline: project?.deadline || '',
     assigned_employees: project?.assigned_employees || [],
     priority: project?.priority || 'medium'
   });
+  
+  const [submitError, setSubmitError] = useState('');
+  const [isSubmitting, setIsSubmitting] = useState(false);

   if (!isOpen) return null;

-  const handleSubmit = (e: React.FormEvent) => {
+  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
+    setSubmitError('');
+    setIsSubmitting(true);
     
-    if (project) {
-      updateProject(project.id, {
-        ...formData,
-        progress_percentage: project.progress_percentage,
-        status: project.status
-      });
-    } else {
-      createProject({
-        ...formData,
-        progress_percentage: 0,
-        status: 'active'
-      });
+    try {
+      if (project) {
+        await updateProject(project.id, {
+          ...formData,
+          progress_percentage: project.progress_percentage,
+          status: project.status
+        });
+      } else {
+        await createProject({
+          ...formData,
+          progress_percentage: 0,
+          status: 'active'
+        });
+      }
+      onClose();
+    } catch (error) {
+      console.error('Error submitting project:', error);
+      setSubmitError(
+        error instanceof Error 
+          ? error.message 
+          : 'Failed to save project. Please check your connection and try again.'
+      );
+    } finally {
+      setIsSubmitting(false);
     }
-    
-    onClose();
   };

   const handleEmployeeToggle = (employeeId: string) => {
@@ .. @@
           </button>
         </div>

+        {submitError && (
+          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
+            <strong>Error:</strong> {submitError}
+          </div>
+        )}
+
         <form onSubmit={handleSubmit} className="p-6 space-y-6">
           <div>
             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
@@ .. @@
           <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
             <button
               type="button"
               onClick={onClose}
+              disabled={isSubmitting}
               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
-              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
+              disabled={isSubmitting}
+              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
             >
-              {project ? 'Update' : 'Create'} Project
+              {isSubmitting ? 'Saving...' : (project ? 'Update' : 'Create')} Project
             </button>
           </div>
         </form>