"""
IP-SAKTI Innovation Passport PDF Report Generator
Generates comprehensive regulatory assessment reports for AYUSH formulations
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle, TA_CENTER, TA_LEFT, TA_JUSTIFY
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, PageTemplate, Frame
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
except ImportError:
    print("ReportLab not installed. Install with: pip install reportlab")

class InnovationPassportGenerator:
    """
    Generates comprehensive Innovation Passport PDF reports for AYUSH formulations
    based on chat history and regulatory assessment results.
    """

    def __init__(self, output_dir: str = "/tmp"):
        self.output_dir = output_dir
        self.passport_id = str(uuid.uuid4())[:12].upper()
        self.generated_date = datetime.now().strftime("%d-%b-%Y")
        self.generated_time = datetime.now().strftime("%H:%M:%S IST")
        
        # Define styles
        self.styles = getSampleStyleSheet()
        self._define_custom_styles()

    def _define_custom_styles(self):
        """Define custom paragraph styles for the report"""
        
        # Title style
        self.styles.add(ParagraphStyle(
            name='ReportTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a5f4a'),  # Deep green
            spaceAfter=10,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='ReportSubtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#2d7a5f'),
            spaceAfter=6,
            alignment=TA_LEFT,
            fontName='Helvetica-Bold'
        ))
        
        # Section heading
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=self.styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#1a5f4a'),
            spaceAfter=8,
            spaceBefore=8,
            fontName='Helvetica-Bold',
            borderPadding=5,
            borderColor=colors.HexColor('#d4af37'),  # Gold
            borderWidth=1,
            borderRadius=3
        ))
        
        # Body text (Renamed to CustomBodyText to avoid conflict)
        self.styles.add(ParagraphStyle(
            name='CustomBodyText',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
            leading=14
        ))
        
        # Emphasis text
        self.styles.add(ParagraphStyle(
            name='Emphasis',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#e74c3c'),
            fontName='Helvetica-Bold',
            spaceAfter=4
        ))
        
        # Disclaimer style
        self.styles.add(ParagraphStyle(
            name='Disclaimer',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#7f8c8d'),
            alignment=TA_LEFT,
            spaceAfter=4,
            leading=10
        ))

    def generate_report(self, 
                       chat_history: List[Dict[str, str]],
                       final_assessment: Dict[str, Any],
                       product_details: Optional[Dict[str, str]] = None,
                       applicant_info: Optional[Dict[str, str]] = None) -> str:
        """
        Generate a complete Innovation Passport Report PDF.

        Args:
            chat_history: List of chat messages [{"role": "user"/"assistant", "content": "..."}]
            final_assessment: The final response dict from query_ip_assistant()
            product_details: Optional product info {"name": "...", "category": "..."}
            applicant_info: Optional applicant info {"name": "...", "email": "...", "organization": "..."}

        Returns:
            Path to generated PDF file
        """
        
        # Prepare content structures
        story = []
        
        # 1. HEADER / COVER PAGE
        story.extend(self._build_header(product_details, applicant_info))
        story.append(PageBreak())
        
        # 2. EXECUTIVE SUMMARY
        story.extend(self._build_executive_summary(final_assessment))
        
        # 3. PRODUCT SUMMARY
        story.extend(self._build_product_summary(chat_history, product_details))
        
        # 4. IP & ABS READINESS SCORE
        story.extend(self._build_readiness_score(final_assessment))
        
        # 5. BIODIVERSITY / ABS COMPLIANCE FLAG
        story.extend(self._build_abs_compliance(final_assessment))
        
        # 6. STATUTORY CITATIONS
        story.extend(self._build_citations(final_assessment))
        
        # 7. TKDL PRIOR-ART ANALYSIS
        story.extend(self._build_prior_art_analysis(final_assessment))
        
        # 8. CONFIDENCE & GROUNDING EVALUATION
        story.extend(self._build_confidence_evaluation(final_assessment))
        
        # 9. RECOMMENDED IP PATHWAY & NEXT ACTIONS
        story.extend(self._build_recommendations(final_assessment))
        
        # 10. DISCLAIMER & LEGAL NOTICE
        story.extend(self._build_disclaimer())
        
        # 11. APPENDIX: Full Chat Transcript
        story.append(PageBreak())
        story.extend(self._build_appendix(chat_history))
        
        # Generate PDF
        pdf_filename = f"IP-SAKTI_Innovation_Passport_{self.passport_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(self.output_dir, pdf_filename)
        
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        doc.build(story, onFirstPage=self._add_footer, onLaterPages=self._add_footer)
        return pdf_path

    def _build_header(self, product_details: Optional[Dict] = None, 
                      applicant_info: Optional[Dict] = None) -> List:
        """Build the header/cover page section"""
        story = []
        
        # IP-SAKTI Logo & Title
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph(
            "🌿 IP-SAKTI SAHAYAK 🌿",
            self.styles['ReportTitle']
        ))
        story.append(Paragraph(
            "Ministry of AYUSH, Government of India",
            self.styles['ReportSubtitle']
        ))
        
        story.append(Spacer(1, 0.2*inch))
        
        # Passport Number & Date
        story.append(Paragraph(
            f"<b>Innovation Passport: IP-SAKTI-{self.passport_id}</b>",
            self.styles['CustomBodyText']
        ))
        story.append(Paragraph(
            f"Generated: {self.generated_date} at {self.generated_time}",
            self.styles['Disclaimer']
        ))
        
        story.append(Spacer(1, 0.3*inch))
        
        # Product Summary
        if product_details:
            story.append(Paragraph(
                "<b>Product Under Assessment:</b>",
                self.styles['SectionHeading']
            ))
            
            product_name = product_details.get('name', 'Not Specified')
            product_category = product_details.get('category', 'Not Specified')
            
            story.append(Paragraph(
                f"<b>Product Name:</b> {product_name}",
                self.styles['CustomBodyText']
            ))
            story.append(Paragraph(
                f"<b>Category:</b> {product_category}",
                self.styles['CustomBodyText']
            ))
        
        story.append(Spacer(1, 0.2*inch))
        
        # Applicant Information
        if applicant_info:
            story.append(Paragraph(
                "<b>Applicant Information:</b>",
                self.styles['SectionHeading']
            ))
            
            applicant_name = applicant_info.get('name', 'Not Provided')
            applicant_email = applicant_info.get('email', 'Not Provided')
            applicant_org = applicant_info.get('organization', 'Not Provided')
            
            story.append(Paragraph(
                f"<b>Name:</b> {applicant_name}",
                self.styles['CustomBodyText']
            ))
            story.append(Paragraph(
                f"<b>Email:</b> {applicant_email}",
                self.styles['CustomBodyText']
            ))
            story.append(Paragraph(
                f"<b>Organization:</b> {applicant_org}",
                self.styles['CustomBodyText']
            ))
        
        story.append(Spacer(1, 0.3*inch))
        
        # Report Confidentiality Notice
        story.append(Paragraph(
            "⚠️ <b>Confidentiality Notice:</b> This report contains proprietary legal and regulatory analysis. "
            "It is intended for use by the applicant and authorized regulatory authorities only.",
            self.styles['Emphasis']
        ))
        
        return story

    def _build_executive_summary(self, final_assessment: Dict[str, Any]) -> List:
        """Build the executive summary section"""
        story = []
        
        story.append(Paragraph(
            "Executive Summary",
            self.styles['SectionHeading']
        ))
        
        # Assessment Status
        status = final_assessment.get('status', 'UNKNOWN')
        intent = final_assessment.get('intent', 'UNKNOWN')
        
        status_color = '#27ae60' if status == 'SUCCESS' else '#e74c3c'
        story.append(Paragraph(
            f"<font color='{status_color}'><b>Assessment Status:</b> {status}</font>",
            self.styles['CustomBodyText']
        ))
        
        story.append(Paragraph(
            f"<b>Query Type:</b> {intent}",
            self.styles['CustomBodyText']
        ))
        
        story.append(Spacer(1, 0.1*inch))
        
        # Key Finding
        answer = final_assessment.get('answer', '')
        # Extract first 150 chars as summary
        summary = answer[:200].replace('\n', ' ') + "..." if len(answer) > 200 else answer
        story.append(Paragraph(
            f"<b>Key Finding:</b> {summary}",
            self.styles['CustomBodyText']
        ))
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_product_summary(self, chat_history: List[Dict[str, str]], 
                              product_details: Optional[Dict] = None) -> List:
        """Build the product summary section from chat history"""
        story = []
        
        story.append(Paragraph(
            "2. Product & Formulation Summary",
            self.styles['SectionHeading']
        ))
        
        if product_details:
            story.append(Paragraph(
                f"<b>Product Name:</b> {product_details.get('name', 'Not Specified')}",
                self.styles['CustomBodyText']
            ))
            story.append(Paragraph(
                f"<b>Category:</b> {product_details.get('category', 'Not Specified')}",
                self.styles['CustomBodyText']
            ))
        
        # Extract product description from first user message
        for msg in chat_history:
            if msg.get('role') == 'user' and len(msg.get('content', '')) > 50:
                user_query = msg.get('content', '')[:300]
                story.append(Paragraph(
                    f"<b>User Query:</b> {user_query}",
                    self.styles['CustomBodyText']
                ))
                break
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_readiness_score(self, final_assessment: Dict[str, Any]) -> List:
        """Build the IP & ABS Readiness Score section"""
        story = []
        
        story.append(Paragraph(
            "3. IP & ABS Readiness Score",
            self.styles['SectionHeading']
        ))
        
        # Calculate readiness score from confidence and other factors
        confidence = final_assessment.get('confidence_score', 0.5)
        readiness_score = int(confidence * 100)
        
        # Determine readiness level
        if readiness_score >= 75:
            readiness_level = "🟢 HIGH READINESS"
            color = '#27ae60'
        elif readiness_score >= 50:
            readiness_level = "🟡 MEDIUM READINESS"
            color = '#f39c12'
        else:
            readiness_level = "🔴 LOW READINESS"
            color = '#e74c3c'
        
        # Create readiness score visual
        score_text = f"<font color='{color}'><b>{readiness_score}/100</b></font> — {readiness_level}"
        story.append(Paragraph(score_text, self.styles['CustomBodyText']))
        
        story.append(Spacer(1, 0.1*inch))
        
        # Readiness Breakdown
        story.append(Paragraph(
            "<b>Readiness Components:</b>",
            self.styles['CustomBodyText']
        ))
        
        # Factor 1: Patentability
        is_comparative = final_assessment.get('is_comparative', False)
        patentability_points = 40 if is_comparative else 30
        story.append(Paragraph(
            f"• <b>Patentability Assessment:</b> {patentability_points}/40 pts — Statutory novelty and non-obviousness evaluated",
            self.styles['Disclaimer']
        ))
        
        # Factor 2: ABS Compliance
        citations_count = len(final_assessment.get('citations', []))
        abs_points = 20 if citations_count >= 2 else 15
        story.append(Paragraph(
            f"• <b>ABS/NBA Compliance:</b> {abs_points}/30 pts — Biological Diversity Act 2002 (as amended 2023) requirements assessed",
            self.styles['Disclaimer']
        ))
        
        # Factor 3: Evidence Quality
        evidence_points = citations_count * 5
        story.append(Paragraph(
            f"• <b>Evidence Quality:</b> {min(evidence_points, 20)}/20 pts — {citations_count} statutory references grounded",
            self.styles['Disclaimer']
        ))
        
        # Factor 4: Applicant Clarity
        clarity_points = 10  # Default if clarification provided
        story.append(Paragraph(
            f"• <b>Applicant Clarity:</b> {clarity_points}/10 pts — Product classification and intended use understood",
            self.styles['Disclaimer']
        ))
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_abs_compliance(self, final_assessment: Dict[str, Any]) -> List:
        """Build the ABS Compliance Flag section"""
        story = []
        
        story.append(Paragraph(
            "4. Biodiversity & ABS Compliance Assessment",
            self.styles['SectionHeading']
        ))
        
        answer = final_assessment.get('answer', '').lower()
        
        # Detect biological resources mention
        uses_biological = any(keyword in answer for keyword in [
            'biological', 'genetic', 'plant', 'herb', 'ayurved', 
            'indigenous', 'traditional', 'nba', 'biodiversity'
        ])
        
        # ABS Compliance Checklist
        story.append(Paragraph(
            "<b>Compliance Checklist:</b>",
            self.styles['CustomBodyText']
        ))
        
        # Check 1: Uses Indian Biological Resources
        status1 = "✅ YES" if uses_biological else "❌ NOT DETECTED"
        story.append(Paragraph(
            f"• <b>Uses Indian Biological Resources?</b> {status1}",
            self.styles['Disclaimer']
        ))
        
        # Check 2: Requires NBA Form-III
        status2 = "✅ REQUIRED" if uses_biological else "❌ NOT REQUIRED"
        story.append(Paragraph(
            f"• <b>Requires NBA Form-III?</b> {status2}",
            self.styles['Disclaimer']
        ))
        
        # Check 3: Vaidya Exemption Eligibility
        is_vaidya_query = any(word in answer for word in [
            'vaidya', 'practitioner', 'livelihood', 'sustenance'
        ])
        status3 = "✅ ELIGIBLE (Section 7 Proviso, BDA 2023)" if is_vaidya_query else "❌ NOT ELIGIBLE"
        story.append(Paragraph(
            f"• <b>Vaidya Exemption Eligible?</b> {status3}",
            self.styles['Disclaimer']
        ))
        
        # Check 4: Benefit Sharing Status
        status4 = "⏳ PENDING NBA APPROVAL" if uses_biological else "✅ NOT APPLICABLE"
        story.append(Paragraph(
            f"• <b>Benefit Sharing Status:</b> {status4}",
            self.styles['Disclaimer']
        ))
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_prior_art_analysis(self, final_assessment: Dict[str, Any]) -> List:
        """Build the TKDL Prior-Art Analysis section"""
        story = []
        
        story.append(Paragraph(
            "5. TKDL Prior-Art Cross-Check",
            self.styles['SectionHeading']
        ))
        
        confidence = final_assessment.get('confidence_score', 0.5)
        
        story.append(Paragraph(
            f"<b>Prior-Art Analysis Confidence:</b> {int(confidence*100)}%",
            self.styles['CustomBodyText']
        ))
        
        story.append(Spacer(1, 0.05*inch))
        
        # Risk Level
        if confidence >= 0.75:
            risk_level = "🟢 LOW RISK"
            risk_color = '#27ae60'
            description = "Formulation appears sufficiently novel with respect to TKDL prior art. Proceed with patent filing."
        elif confidence >= 0.50:
            risk_level = "🟡 MEDIUM RISK"
            risk_color = '#f39c12'
            description = "Some similarities detected with traditional knowledge. Recommend additional novelty documentation."
        else:
            risk_level = "🔴 HIGH RISK"
            risk_color = '#e74c3c'
            description = "Significant TKDL overlap detected. Section 3(p) patentability challenges likely. Consider alternative IP strategies."
        
        story.append(Paragraph(
            f"<font color='{risk_color}'><b>Prior-Art Risk Level: {risk_level}</b></font>",
            self.styles['CustomBodyText']
        ))
        
        story.append(Paragraph(
            f"<b>Assessment:</b> {description}",
            self.styles['CustomBodyText']
        ))
        
        # Source documents
        sources = final_assessment.get('sources', [])
        if sources:
            story.append(Spacer(1, 0.05*inch))
            story.append(Paragraph(
                f"<b>Referenced Documents:</b> {', '.join(sources[:3])}",
                self.styles['Disclaimer']
            ))
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_citations(self, final_assessment: Dict[str, Any]) -> List:
        """Build the Statutory Citations section"""
        story = []
        
        story.append(Paragraph(
            "6. Statutory & Treaty Citations",
            self.styles['SectionHeading']
        ))
        
        citations = final_assessment.get('citations', [])
        
        if not citations:
            story.append(Paragraph(
                "No specific statutory citations available in this assessment.",
                self.styles['Disclaimer']
            ))
        else:
            # Build citations table
            citation_data = [["Statute/Treaty", "Section/Article", "Page"]]
            
            for citation in citations[:10]:  # Limit to 10 most relevant
                act_name = citation.get('act_name', 'Unknown')
                section = citation.get('section', 'General')
                page = citation.get('page_number', 'N/A')
                citation_data.append([act_name, section, str(page)])
            
            citation_table = Table(citation_data, colWidths=[2.5*inch, 2*inch, 1*inch])
            citation_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a5f4a')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            
            story.append(citation_table)
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_confidence_evaluation(self, final_assessment: Dict[str, Any]) -> List:
        """Build the Confidence Evaluation section"""
        story = []
        
        story.append(Paragraph(
            "7. Confidence & Grounding Evaluation",
            self.styles['SectionHeading']
        ))
        
        confidence = final_assessment.get('confidence_score', 0.5)
        grounding = final_assessment.get('grounding_verified', None)
        escalation = final_assessment.get('escalation_required', False)
        
        # Confidence Score Visual
        if confidence >= 0.70:
            confidence_status = "🟢 HIGH CONFIDENCE"
            confidence_color = '#27ae60'
        elif confidence >= 0.50:
            confidence_status = "🟡 MEDIUM CONFIDENCE"
            confidence_color = '#f39c12'
        else:
            confidence_status = "🔴 LOW CONFIDENCE"
            confidence_color = '#e74c3c'
        
        story.append(Paragraph(
            f"<font color='{confidence_color}'><b>Confidence Score: {int(confidence*100)}/100</b></font> — {confidence_status}",
            self.styles['CustomBodyText']
        ))
        
        story.append(Spacer(1, 0.05*inch))
        
        # Grounding Status
        if grounding is True:
            grounding_text = "✅ <b>Grounding Verified:</b> Response is grounded in retrieved statutory corpus"
        elif grounding is False:
            grounding_text = "❌ <b>Grounding Not Verified:</b> Response may contain generalized legal guidance"
        else:
            grounding_text = "⚠️ <b>Grounding Status:</b> Unable to verify — escalated for human review"
        
        story.append(Paragraph(grounding_text, self.styles['CustomBodyText']))
        
        story.append(Spacer(1, 0.05*inch))
        
        # Escalation Status
        if escalation:
            story.append(Paragraph(
                "⚠️ <b>Escalation Required:</b> This assessment requires expert human facilitator review before legal filing.",
                self.styles['Emphasis']
            ))
        else:
            story.append(Paragraph(
                "✅ <b>Ready for Next Steps:</b> Assessment confidence sufficient for preliminary regulatory planning.",
                self.styles['CustomBodyText']
            ))
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_recommendations(self, final_assessment: Dict[str, Any]) -> List:
        """Build the Recommended IP Pathway section"""
        story = []
        
        story.append(Paragraph(
            "8. Recommended IP Pathway & Next Actions",
            self.styles['SectionHeading']
        ))
        
        answer = final_assessment.get('answer', '')
        
        story.append(Paragraph(
            "<b>Strategic Recommendation:</b>",
            self.styles['CustomBodyText']
        ))
        
        # Extract action items from answer
        story.append(Paragraph(
            answer[:500] if len(answer) > 500 else answer,
            self.styles['CustomBodyText']
        ))
        
        story.append(Spacer(1, 0.1*inch))
        
        # Jurisdiction Scope
        is_comparative = final_assessment.get('is_comparative', False)
        if is_comparative:
            story.append(Paragraph(
                "<b>Jurisdiction Scope:</b> 🌍 COMPARATIVE (India + International)",
                self.styles['CustomBodyText']
            ))
            story.append(Paragraph(
                "Recommend dual-track approach: Domestic NBA Form-III + PCT patent filing with WIPO GRATK Article 3 compliance.",
                self.styles['Disclaimer']
            ))
        else:
            story.append(Paragraph(
                "<b>Jurisdiction Scope:</b> 🇮🇳 INDIA (Domestic)",
                self.styles['CustomBodyText']
            ))
            story.append(Paragraph(
                "Recommend domestic patent filing with mandatory NBA Section 6 prior approval and TKDL novelty verification.",
                self.styles['Disclaimer']
            ))
        
        story.append(Spacer(1, 0.1*inch))
        
        # Timeline
        story.append(Paragraph(
            "<b>Recommended Timeline:</b>",
            self.styles['CustomBodyText']
        ))
        story.append(Paragraph(
            "1. <b>Week 1-2:</b> Gather evidence (ingredient sourcing, traditional reference texts, formulation notes)<br/>"
            "2. <b>Week 2-3:</b> File NBA Form-III (if biological resources used)<br/>"
            "3. <b>Week 3-4:</b> Prepare patent application with TK disclosure & benefit-sharing agreement<br/>"
            "4. <b>Week 4-6:</b> File domestic patent application with IPO India<br/>"
            "5. <b>Month 2-3:</b> File PCT application (if international protection needed)",
            self.styles['Disclaimer']
        ))
        
        story.append(Spacer(1, 0.15*inch))
        return story

    def _build_disclaimer(self) -> List:
        """Build the Legal Disclaimer section"""
        story = []
        
        story.append(PageBreak())
        
        story.append(Paragraph(
            "9. Legal Disclaimer & Confidentiality Notice",
            self.styles['SectionHeading']
        ))
        
        disclaimer_text = """
        <b>IP-SAKTI Sahayak Regulatory Diagnostic Disclaimer:</b><br/><br/>
        
        1. <b>Non-Binding Assessment:</b> This Innovation Passport Report is an AI-generated preliminary regulatory assessment 
        and does not constitute legal advice. Applicants must consult a qualified Intellectual Property attorney or legal advisor 
        before filing any patent applications or regulatory submissions.<br/><br/>
        
        2. <b>Statutory Compliance:</b> This assessment is grounded in the Patents Act 1970, Biological Diversity Act 2002 
        (as amended in 2023), Drugs & Cosmetics Act 1940, WIPO GRATK Treaty 2024, and Nagoya Protocol. However, statutory 
        requirements and judicial interpretations evolve. The applicant remains solely responsible for current compliance verification.<br/><br/>
        
        3. <b>Medical Disclaimer:</b> This system does NOT provide medical diagnosis, treatment recommendations, or clinical advice. 
        For health-related queries, consult a qualified Ayurvedic practitioner (Vaidya) or registered physician.<br/><br/>
        
        4. <b>Confidence Limitations:</b> Confidence scores reflect corpus-grounded retrieval confidence, not legal certainty. 
        Low confidence assessments require expert human facilitator review.<br/><br/>
        
        5. <b>Confidentiality:</b> This report is proprietary and intended for use by the applicant and authorized regulatory authorities only. 
        Unauthorized reproduction or distribution is prohibited.<br/><br/>
        
        6. <b>No Warranty:</b> IP-SAKTI Sahayak is provided "as-is" without warranty. The Ministry of AYUSH is not liable for errors, 
        omissions, or consequences arising from reliance on this assessment.<br/><br/>
        
        <b>Last Updated:</b> Biodiversity Act 2002 amendment (May 2023); WIPO GRATK Treaty (June 2024).
        """
        
        story.append(Paragraph(disclaimer_text, self.styles['Disclaimer']))
        
        story.append(Spacer(1, 0.2*inch))
        
        # Contact Information
        story.append(Paragraph(
            "<b>For Further Assistance:</b>",
            self.styles['CustomBodyText']
        ))
        story.append(Paragraph(
            "📧 Email: support@ip-sakti.gov.in<br/>"
            "🌐 Portal: https://ip-sakti.ayush.gov.in<br/>"
            "📞 Facilitation Desk: +91-11-XXXX-XXXX",
            self.styles['Disclaimer']
        ))
        
        return story

    def _build_appendix(self, chat_history: List[Dict[str, str]]) -> List:
        """Build the appendix with full chat transcript"""
        story = []
        
        story.append(Paragraph(
            "Appendix: Full Conversation Transcript",
            self.styles['SectionHeading']
        ))
        
        for i, msg in enumerate(chat_history[-20:], 1):  # Last 20 messages
            role = msg.get('role', 'unknown').upper()
            content = msg.get('content', '')
            
            # Truncate long messages
            display_content = content[:300] + "..." if len(content) > 300 else content
            
            role_color = '#1a5f4a' if role == 'USER' else '#2d7a5f'
            story.append(Paragraph(
                f"<font color='{role_color}'><b>[{role}]:</b></font> {display_content}",
                self.styles['Disclaimer']
            ))
            story.append(Spacer(1, 0.05*inch))
        
        return story

    def _add_footer(self, canvas_obj, doc):
        """Add footer to each page"""
        canvas_obj.saveState()
        
        footer_text = f"IP-SAKTI Innovation Passport {self.passport_id} | Generated {self.generated_date}"
        canvas_obj.setFont("Helvetica", 8)
        canvas_obj.setFillColor(colors.HexColor('#7f8c8d'))
        canvas_obj.drawString(0.75*inch, 0.5*inch, footer_text)
        canvas_obj.drawString(7.5*inch, 0.5*inch, f"Page {doc.page}")
        
        canvas_obj.restoreState()


# Integration Helper Function
def generate_passport_from_session(chat_history: List[Dict[str, str]],
                                  final_assessment: Dict[str, Any],
                                  product_name: str = "Formulation",
                                  applicant_name: str = "User",
                                  output_dir: str = "/tmp") -> str:
    """
    Convenience function to generate Innovation Passport from a complete session.
    
    Args:
        chat_history: List of chat messages
        final_assessment: Final response from query_ip_assistant()
        product_name: Name of the product
        applicant_name: Name of the applicant
        output_dir: Directory to save PDF
    
    Returns:
        Path to generated PDF
    """
    
    generator = InnovationPassportGenerator(output_dir=output_dir)
    
    product_details = {
        'name': product_name,
        'category': final_assessment.get('intent', 'AYUSH Formulation')
    }
    
    applicant_info = {
        'name': applicant_name,
        'email': 'user@applicant.in',
        'organization': 'AYUSH Formulation Developer'
    }
    
    pdf_path = generator.generate_report(
        chat_history=chat_history,
        final_assessment=final_assessment,
        product_details=product_details,
        applicant_info=applicant_info
    )
    
    return pdf_path


if __name__ == "__main__":
    # Test example
    print("Innovation Passport Report Generator loaded successfully!")
    print("Use generate_passport_from_session() to create reports from backend.")