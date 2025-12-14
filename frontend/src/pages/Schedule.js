import { useState } from 'react';
import { useActionData, Form, useNavigation } from 'react-router-dom';
import styles from './Schedule.module.css';
import { 
  Card, 
  Button,
  Badge
} from '../components/dashboard';
import { 
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import ScheduleSummary from '../components/schedule/ScheduleSummary';

function calculateShiftLength(start, end) {
  if (start < end) {
    return end - start;
  }
  return 24 - start + end;
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'generate') {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { error: 'Unauthorized' };

      const shifts = [];
      const shiftCount = parseInt(formData.get('shift_count'));
      
      for (let i = 0; i < shiftCount; i++) {
        shifts.push({
          name: formData.get(`shift_${i}_name`),
          start_hour: parseInt(formData.get(`shift_${i}_start`)),
          length: calculateShiftLength(parseInt(formData.get(`shift_${i}_start`)), parseInt(formData.get(`shift_${i}_end`))),
          required: parseInt(formData.get(`shift_${i}_employees`))
        });
      }

      const requestData = {
        month: formData.get('month'),
        year: formData.get('year'),
        shifts: shifts,
        holidays_mode: formData.get('holidays_mode') === 'on',
        rules: {
            min_rest_hours: parseInt(formData.get('min_break_hours')),
            max_consecutive_days: 6,
            standard_daily_hours: 8
        },
        company_work_mode: formData.get('company_work_mode')
      };
        
      const response = await fetch('http://127.0.0.1:8000/schedule/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || 'Failed to generate schedule' };
      }

      const data = await response.json();
      return { success: true, schedule: data.schedule, summary: data.summary, meta: data.meta };
    } catch (error) {
      console.error('Generation error:', error);
      return { error: error.message || 'An error occurred' };
    }
  }
  return { error: 'Invalid action' };
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Schedule() {
  const actionData = useActionData();
  const navigation = useNavigation();
  
  const [showForm, setShowForm] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [shifts, setShifts] = useState([
    { name: 'Morning', start: '6', end: '14', employees: 2 },
    { name: 'Afternoon', start: '14', end: '22', employees: 2 },
    { name: 'Night', start: '22', end: '6', employees: 1 }
  ]);

  const isSubmitting = navigation.state === 'submitting';

  const scheduleData = actionData?.schedule;
  const hasSchedule = Array.isArray(scheduleData) && scheduleData.length > 0;

  const displayMonth = actionData?.meta?.month || selectedMonth;
  const displayYear = actionData?.meta?.year || selectedYear;
  const summary = actionData?.summary;
  const meta = actionData?.meta;

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const scheduleByDay = hasSchedule 
    ? scheduleData.reduce((acc, dayEntry) => {
        acc[dayEntry.day] = {};
        dayEntry.shifts.forEach(shiftEntry => {
          acc[dayEntry.day][shiftEntry.shift] = shiftEntry.employees;
        });
        return acc;
      }, {})
    : {};

  const daysInMonth = getDaysInMonth(displayMonth, displayYear);
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  const currentWeekDays = weeks[currentWeek] || [];

  let shiftTypes = [];
  if (hasSchedule && Object.keys(scheduleByDay).length > 0) {
    const firstDayWithShifts = Object.values(scheduleByDay).find(day => Object.keys(day).length > 0);
    if (firstDayWithShifts) {
        shiftTypes = Object.keys(firstDayWithShifts);
    }
  }

  const addShift = () => {
    setShifts([...shifts, { name: `Shift ${shifts.length + 1}`, start: '08:00', end: '16:00', employees: 2 }]);
  };

  const removeShift = (index) => {
    if (shifts.length > 1) {
      setShifts(shifts.filter((_, i) => i !== index));
    }
  };

  const updateShift = (index, field, value) => {
    const newShifts = [...shifts];
    newShifts[index][field] = value;
    setShifts(newShifts);
  };

  const getShiftColor = (employeeCount) => {
    if (!employeeCount || employeeCount === 0) return 'secondary';
    if (employeeCount >= 2) return 'success';
    return 'warning';
  };

  const getDayOfWeek = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
  };

  return (
    <div className={styles.schedulePage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Schedule Generation</h1>
          <p className={styles.pageSubtitle}>Automatically generate work schedules for the month</p>
        </div>
        <Button 
          color="primary" 
          onClick={() => setShowForm(!showForm)}
        >
          <FaCog /> {showForm ? 'Hide Settings' : 'Show Settings'}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {actionData?.success && (
        <div className={styles.alertSuccess}>
          <FaCheckCircle /> Schedule generated successfully!
        </div>
      )}
      {actionData?.error && (
        <div className={styles.alertDanger}>
          <FaExclamationTriangle /> {actionData.error}
        </div>
      )}

      {/* Generation Form */}
      {showForm && (
        <Card header="Generation Settings" color="primary">
          <Form method="post" className={styles.generationForm}>
            <input type="hidden" name="intent" value="generate" />
            <input type="hidden" name="shift_count" value={shifts.length} />

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Month *</label>
                <select 
                  name="month" 
                  required 
                  className={styles.formInput}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {MONTH_NAMES.map((month, idx) => (
                    <option key={idx} value={idx + 1}>{month}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Year *</label>
                <input 
                  type="number" 
                  name="year" 
                  required 
                  min="2024"
                  max="2030"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Minimum Break Between Shifts (hours) *</label>
                <input 
                  type="number" 
                  name="min_break_hours" 
                  required 
                  min="8"
                  max="24"
                  defaultValue="11"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Company work mode</label>
                <select name="company_work_mode" className={styles.formInput}>
                  <option value="mon_fri">Monday-Friday Only</option>
                  <option value="mon_sat">Monday-Saturday Only</option>
                  <option value="every_day">Every Day</option>
                </select>
              </div>

              <div className={styles.formGroupCheckBox}>
                <label>Holidays mode</label>
                <input name="holidays_mode" type='checkbox'/>
              </div>
            </div>

            <div className={styles.shiftsSection}>
              <div className={styles.sectionHeader}>
                <h3>Work Shifts</h3>
                <Button 
                  type="button"
                  color="success" 
                  size="sm" 
                  onClick={addShift}
                >
                  <FaPlus /> Add Shift
                </Button>
              </div>

              {shifts.map((shift, index) => (
                <div key={index} className={styles.shiftItem}>
                  <div className={styles.shiftHeader}>
                    <span>Shift {index + 1}</span>
                    {shifts.length > 1 && (
                      <Button 
                        type="button"
                        color="danger" 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeShift(index)}
                      >
                        <FaMinus />
                      </Button>
                    )}
                  </div>

                  <div className={styles.shiftFields}>
                    <div className={styles.formGroup}>
                      <label>Shift Name</label>
                      <input 
                        type="text"
                        name={`shift_${index}_name`}
                        value={shift.name}
                        onChange={(e) => updateShift(index, 'name', e.target.value)}
                        placeholder="Morning, Afternoon..."
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Start Time</label>
                      <input 
                        type="number"
                        name={`shift_${index}_start`}
                        value={shift.start}
                        onChange={(e) => updateShift(index, 'start', e.target.value)}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>End Time</label>
                      <input 
                        type="number"
                        name={`shift_${index}_end`}
                        value={shift.end}
                        onChange={(e) => updateShift(index, 'end', e.target.value)}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Employees</label>
                      <input 
                        type="number"
                        name={`shift_${index}_employees`}
                        value={shift.employees}
                        onChange={(e) => updateShift(index, 'employees', parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className={styles.formInput}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.formActions}>
              <Button 
                type="submit" 
                color="success" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Generating...' : 'Generate Schedule'}
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {/* Schedule Display - Показуємо ТІЛЬКИ якщо є scheduleData */}
      {hasSchedule && (
        <>
          <Card>
            <div className={styles.viewControls}>
              <div className={styles.weekNavigation}>
                <Button
                  color="secondary"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                  disabled={currentWeek === 0}
                >
                  <FaChevronLeft /> Previous Week
                </Button>
                <span className={styles.weekLabel}>
                  Week {currentWeek + 1} of {weeks.length}
                </span>
                <Button
                  color="secondary"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(Math.min(weeks.length - 1, currentWeek + 1))}
                  disabled={currentWeek === weeks.length - 1}
                >
                  Next Week <FaChevronRight />
                </Button>
              </div>

              <Button color="info" variant="outline" size="sm">
                <FaDownload /> Export
              </Button>
            </div>
          </Card>

          <Card header={`Schedule for ${MONTH_NAMES[displayMonth - 1]} ${displayYear}`} color="success">
            <div className={styles.scheduleGrid}>
              <div className={styles.scheduleTable}>
                {/* Header Row */}
                <div className={styles.scheduleHeader}>
                  <div className={styles.headerCell}>Day / Shift</div>
                  {currentWeekDays.map(day => {
                    const dayOfWeek = getDayOfWeek(day, displayMonth, displayYear);
                    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; 
                    const isClosed = !scheduleByDay[day];
                    
                    return (
                      <div 
                        key={day} 
                        className={`${styles.headerCell} ${isWeekend ? styles.weekend : ''} ${isClosed ? styles.closed : ''}`}
                      >
                        <div className={styles.dayNumber}>{day}</div>
                        <div className={styles.dayName}>
                          {DAY_NAMES[dayOfWeek]}
                        </div>
                        {isClosed && <div className={styles.closedLabel}>Closed</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Shift Rows */}
                {shiftTypes.length > 0 ? (
                  shiftTypes.map(shiftType => (
                    <div key={shiftType} className={styles.scheduleRow}>
                      <div className={styles.shiftCell}>
                        <strong>{shiftType}</strong>
                      </div>
                      {currentWeekDays.map(day => {
                        const daySchedule = scheduleByDay[day];
                        const shiftEmployees = daySchedule?.[shiftType] || [];
                        const isClosed = !scheduleByDay[day];

                        return (
                          <div 
                            key={`${day}-${shiftType}`} 
                            className={`${styles.dayCell} ${isClosed ? styles.closedCell : ''}`}
                          >
                            {!isClosed && (
                              <>
                                <Badge 
                                  color={getShiftColor(shiftEmployees.length)} 
                                  className={styles.employeeCount}
                                >
                                  {shiftEmployees.length} staff
                                </Badge>
                                <div className={styles.employeeList}>
                                  {shiftEmployees.map((emp, idx) => (
                                    <div key={idx} className={styles.employeeChip}>
                                      {emp}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className={styles.noShifts}>
                    No shifts scheduled for this week
                  </div>
                )}
              </div>
            </div>
          </Card>
          <ScheduleSummary summary={summary} meta={meta}/>
        </>
      )}
    </div>
  );
}