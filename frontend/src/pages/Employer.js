import { useState } from 'react';
import { useLoaderData, useActionData, Form, useNavigation } from 'react-router-dom';
import styles from './Employer.module.css';
import { 
  Card, 
  Button,
} from '../components/dashboard';
import { 
  FaBuilding,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import fetcher from '../api/fetcher';

// Loader function - fetches employer data
export async function loader() {
    try {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Response('Unauthorized', { status: 401 });
    }

    const response = await fetcher('/employer', {
        headers: {
        'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        console.log(error)
        return { error: "Failed to load employer data: " + error.detail }
    }

    const data = await response.json();
    return { employer: data };
    } catch (error) {
    console.error('Loader error:',error );


    }
}

// Action function - handles form submission
export async function action({ request }) {
    const formData = await request.formData();

    try {
        const token = localStorage.getItem('token');
        if (!token) {
        return { error: 'Unauthorized' };
        }

        const updateData = {
        name: formData.get('name'),
        address: formData.get('address'),
        };

        const response = await fetcher('/employer', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.detail || 'Failed to update employer data' };
        }

        const data = await response.json();
        return { success: true, employer: data };

    } catch (error) {
        console.error('Action error:', error);
        return { error: error.message || 'An error occurred' };
    }
}

export default function EmployerPage() {
    const { employer, error: loaderError } = useLoaderData();
    const actionData = useActionData();
    const navigation = useNavigation();
    const [isEditing, setIsEditing] = useState(false);
    const isSubmitting = navigation.state === 'submitting';

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
    <div className={styles.employerPage}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
        <div>
            <h1 className={styles.pageTitle}>Employer Management</h1>
            <p className={styles.pageSubtitle}>Manage your company information</p>
        </div>
        {!isEditing ? (
            <Button color="primary" onClick={() => setIsEditing(true)}>
            <FaEdit /> Edit Information
            </Button>
        ) : (
            <div className={styles.headerActions}>
            <Button 
                color="danger" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
            >
                <FaTimes /> Cancel
            </Button>
            </div>
        )}
        </div>

        {/* Action Feedback */}
        {actionData?.success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <FaCheckCircle /> Company information updated successfully!
        </div>
        )}
        {actionData?.error && (
        <div className={`${styles.alert} ${styles.alertDanger}`}>
            <FaExclamationTriangle /> {actionData.error}
        </div>
        )}
        {loaderError && (
        <div className={`${styles.alert} ${styles.alertDanger}`}>
            <FaExclamationTriangle /> {loaderError}
        </div>
        )}  

        {/* Company Information Form */}
        <Form method="post" className={styles.employerForm}>
        <input type="hidden" name="intent" value="update" />
        
        <Card header="Company Information" color="primary">
            <div className={styles.formContent} key={isEditing ? 'edit' : 'view'}>
            <div className={styles.formGroup}>
                <label htmlFor="name">
                <FaBuilding className={styles.labelIcon} />
                Company Name *
                </label>
                <input
                type="text"
                id="name"
                name="name"
                defaultValue={employer?.name || ''}
                disabled={!isEditing}
                required
                className={styles.formInput}
                placeholder="Enter company name"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="address">
                <FaMapMarkerAlt className={styles.labelIcon} />
                Address *
                </label>
                <textarea
                id="address"
                name="address"
                defaultValue={employer?.address || ''}
                disabled={!isEditing}
                required
                rows={3}
                className={styles.formInput}
                placeholder="Enter company address"
                />
            </div>

            {isEditing && (
                <div className={styles.formActions}>
                <Button 
                    type="submit" 
                    color="success" 
                    disabled={isSubmitting}
                    className={styles.saveButton}
                >
                    <FaSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                </div>
            )}
            </div>
        </Card>
        </Form>
    </div>
    );
}