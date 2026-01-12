import styles from './ScheduleSummary.module.css';
import { Card, Badge } from '../dashboard';

/**
 * ScheduleSummary Component
 * Displays employee work summary and meta information for generated schedule
 * 
 * @param {Object} summary - Employee work data { employeeName: { shifts, hours, target } }
 * @param {Object} meta - Schedule metadata { days_in_month, scheduled_days_count, full_time_hours_used, max_hours_per_employee }
 */
export default function ScheduleSummary({ summary, meta }) {
    console.log('Summary: ', summary)
    console.log('meta: ', meta)
  if (!summary || !meta) {
    return null;
  }

  return (
    <div className={styles.summaryContainer}>
      {/* Meta Information Cards */}
      <div className={styles.statsGrid}>
        <Card header="Month Overview" color="info">
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Days in Month</div>
              <div className={styles.metaValue}>{meta.days_in_month}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Scheduled Days</div>
              <div className={styles.metaValue}>{meta.scheduled_days_count}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Full-Time Hours</div>
              <div className={styles.metaValue}>{meta.full_time_hours_used}h</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Max Hours/Employee</div>
              <div className={styles.metaValue}>{meta.max_hours_per_employee}h</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Employee Summary Table */}
      <Card header="Employee Work Summary" color="primary">
        <div className={styles.summaryTable}>
          {/* Header */}
          <div className={styles.summaryHeader}>
            <div className={styles.summaryHeaderCell}>Employee</div>
            <div className={styles.summaryHeaderCell}>Shifts</div>
            <div className={styles.summaryHeaderCell}>Hours Worked</div>
            <div className={styles.summaryHeaderCell}>Target Hours</div>
            <div className={styles.summaryHeaderCell}>Status</div>
          </div>

          {/* Employee Rows */}
          {Object.entries(summary).map(([name, data]) => {
            const percentage = (data.hours / data.target) * 100;
            const diff = data.hours - data.target;
            const status = diff === 0 ? 'on-track' : diff > 0 ? 'over' : 'under';
            
            return (
              <div key={name} className={styles.summaryRow}>
                <div className={styles.summaryCell}>
                  <strong>{name}</strong>
                </div>
                <div className={styles.summaryCell}>
                  <Badge color="primary">{data.shifts} shifts</Badge>
                </div>
                <div className={styles.summaryCell}>
                  <span className={styles.hours}>{data.hours}h</span>
                </div>
                <div className={styles.summaryCell}>
                  <span className={styles.target}>{data.target}h</span>
                </div>
                <div className={styles.summaryCell}>
                  <div className={styles.statusContainer}>
                    <div className={styles.progressBarContainer}>
                      <div 
                        className={`${styles.progressBar} ${styles[`progress-${status}`]}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <Badge 
                      color={status === 'on-track' ? 'success' : status === 'over' ? 'warning' : 'danger'}
                      className={styles.statusBadge}
                    >
                      {diff === 0 ? 'On Track' : diff > 0 ? `+${diff}h` : `${diff}h`}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}