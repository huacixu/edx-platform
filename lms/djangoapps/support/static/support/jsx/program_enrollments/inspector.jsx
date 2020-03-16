import React from 'react';
import PropTypes from 'prop-types';
import { Button, InputText, StatusAlert, InputSelect } from '@edx/paragon';


const renderUserSection = userObj => (
  <div>
    <h2>
      edX account Info
    </h2>
    <div>
      <div><span>Username: </span> {userObj.username}</div>
      <div><span>Email: </span> {userObj.email}</div>
      {userObj.external_user_key && (
        <div><span>External User Key</span>: {userObj.external_user_key}</div>
      )}
      {userObj.SSO ? (
        <div>
          <h3>Single Sign On Record:</h3>
          <div><span>UID</span>{userObj.SSO.uid}</div>
          <div><span>Identity Provider</span>{userObj.SSO.provider}</div>
        </div>
      ) : (
        <div> There is no Single Signed On record associated with this user!</div>)}
    </div>
  </div>
);


const renderVerificationSection = verificationStatus => (
  <div>
    <h2>
      ID Verification
    </h2>
    <div>
      <div><span>Status: </span> {verificationStatus.status}</div>
      <div><span>Verification Error: </span> {verificationStatus.error}</div>
      <div><span>Should Display Verification: </span> {verificationStatus.should_display}</div>
      <div><span>Verification Expiration Date: </span>
        {verificationStatus.verification_expiry}
      </div>
    </div>
  </div>
);

const renderEnrollmentsSection = enrollments => (
  <div>
    <h2>
      Program Enrollments
    </h2>
    <div>
      {enrollments.map(enrollment => (
        <div>
          <div>For Program {enrollment.program_uuid}, the enrollment record is</div>
          <div> <span>Status: </span> {enrollment.status} </div>
          <div> <span>Created: </span> {enrollment.created} </div>
          <div> <span>Last updated: </span> {enrollment.modified} </div>
          <div> <span>External User Key: </span> {enrollment.external_user_key} </div>
          {enrollment.program_course_enrollments && enrollment.program_course_enrollments.map(
            programCourseEnrollment => (
              <div>
                <h3>Course {programCourseEnrollment.course_key}</h3>
                <div><span>Status: </span> {programCourseEnrollment.status} </div>
                <div> <span>Created: </span> {programCourseEnrollment.created} </div>
                <div> <span>Last updated: </span> {programCourseEnrollment.modified} </div>
                {programCourseEnrollment.course_enrollment && (
                  <div>
                    <h4>Linked course enrollment</h4>
                    <div><span>Course ID: </span>
                      {programCourseEnrollment.course_enrollment.course_id}
                    </div>
                    <div> <span>Is Active: </span>
                      {programCourseEnrollment.course_enrollment.is_active}
                    </div>
                    <div> <span>Mode / Track: </span>
                      {programCourseEnrollment.course_enrollment.mode}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  </div>
);


export const ProgramEnrollmentsInspectorPage = props => (
  <div>
    <form method="get">
      {props.errors.map(errorItem => (
        <StatusAlert
          open
          dismissible={false}
          alertType="danger"
          dialog={errorItem}
        />
      ))}
      <div key="edX_accounts">
        <InputText
          name="edx_user"
          label="edX account username or email"
          value={
            (
              props.learnerInfo &&
              props.learnerInfo.user &&
              props.learnerInfo.user.username
            ) || ''
          }
        />
      </div>
      <div key="school_accounts">
        <InputSelect
          name="IdPSelect"
          label="Learner Account Providers"
          value="Select One"
          options={
            props.orgKeys
          }
        />

        <InputText
          name="external_user_key"
          label="Institution user key from school. For example, GTPersonDirectoryId for GT students"
          value={
            (
              props.learnerInfo &&
              props.learnerInfo.user &&
              props.learnerInfo.user.external_user_key
            ) || ''
          }
        />
      </div>
      <Button label="Search" type="submit" className={['btn', 'btn-primary']} />
    </form>
    <div id="search_result_table_container">
      <h1> Search Result </h1>
      {props.learnerInfo &&
        props.learnerInfo.user &&
        renderUserSection(props.learnerInfo.user)}
      {props.learnerInfo &&
        props.learnerInfo.id_verification &&
        renderVerificationSection(props.learnerInfo.id_verification)}
      {props.learnerInfo &&
        props.learnerInfo.enrollments &&
        renderEnrollmentsSection(props.learnerInfo.enrollments)}
    </div>
  </div>
);

ProgramEnrollmentsInspectorPage.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
  learnerInfo: PropTypes.shape({
    user: PropTypes.shape({
      external_user_key: PropTypes.string,
      username: PropTypes.string,
    }),
    id_verification: PropTypes.shape({
      status: PropTypes.string,
      error: PropTypes.string,
      should_display: PropTypes.string,
      verification_expiry: PropTypes.string,
    }),
    enrollments: PropTypes.arrayOf(
      PropTypes.string,
    ),
  }),
  orgKeys: PropTypes.arrayOf(PropTypes.object),
};

ProgramEnrollmentsInspectorPage.defaultProps = {
  errors: [],
  learnerInfo: {},
  orgKeys: [],
};
