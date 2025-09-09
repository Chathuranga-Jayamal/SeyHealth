const db = require("../config/db");

// Get a patient's full history
exports.getPatientHistory = async (puid) => {
  // Basic patient info
  const [patientRows] = await db.query(
    `SELECT history
     FROM Patients
     WHERE puid = ?`,
    [puid]
  );

  if (patientRows.length === 0) return null;

  // Allergies
  const [allergyRows] = await db.query(
    `SELECT allergies
     FROM Patient_Allergies pa
     WHERE pa.puid = ?`,
    [puid]
  );

  // Treatments
  const [treatmentRows] = await db.query(
    `SELECT treatment
     FROM Patient_Treatment pt
     WHERE pt.puid = ?`,
    [puid]
  );

  return {
    history: patientRows[0].history,
    allergies: allergyRows.map(ar => ar.allergies),
    treatments: treatmentRows.map(tr => tr.treatment),
  };
};
exports.setPatientHistory = async (puid, data) => {
    const { history,  allergies, treatments} = data;
    await db.query(
        `UPDATE Patients SET history=? WHERE puid=?`,
        [history, puid]
    );
    await db.query(
        `DELETE from Patient_Allergies WHERE puid=?`,
        [puid]
    );
    if(Array.isArray(allergies) && allergies.length > 0){
        const placeholders = allergies.map(() => "(?, ?)").join(", ");
        const query = `INSERT INTO Patient_Allergies (puid, allergies) VALUES ${placeholders}`;
        const params = allergies.flatMap(allergy => [puid, allergy]);
        await db.query(query, params)
    }
    await db.query(
        `DELETE from Patient_Treatment WHERE puid=?`,
        [puid]
    );
    if(Array.isArray(treatments) && treatments.length > 0 ){
        const placeholders = treatments.map(() => "(?, ?)").join(", ");
        const query = `INSERT INTO Patient_Treatment (puid, treatment) VALUES ${placeholders}`;
        const params = treatments.flatMap(treatment => [puid, treatment]);
        await db.query(query, params)
    }
    return { message: "Patient history created successfully" };
};

